'use strict';
// Pynault Desktop: untrusted websites NEVER share the privileged React shell.
const { app, BrowserWindow, WebContentsView, ipcMain, session, dialog, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const os = require('node:os');
const {webContents} = require('electron');
const DOMAINS=require('../../src/privacy/domains.json');

const DEV = !app.isPackaged;
const HOME = 'pynault://newtab';
const AD_HOSTS=new Set(DOMAINS.ads);
const BLOCK_HOSTS=new Set([...DOMAINS.ads,...DOMAINS.trackers]);
const blockedBy=host=>[...BLOCK_HOSTS].some(d=>host===d||host.endsWith('.'+d));
const tabs = new Map();
let mainWindow, currentId=null, contentVisible=true, viewport={x:240,y:95,width:1000,height:620};
let shieldEnabled = true, locationBlocked = true;
let blockedCount=0;let siteExceptions=[];
let mountedView = null;
let relayServer=null;
async function startLocalRelay(){
 if(!relayServer){const {createRelayServer}=await import('../../services/link-relay/server.mjs');
  relayServer=createRelayServer({port:18765,host:'0.0.0.0'});
  await new Promise((resolve,reject)=>{relayServer.once('listening',resolve);relayServer.once('error',reject)});
 }
 const nets=Object.values(os.networkInterfaces()).flat().filter(Boolean);
 const ip=nets.find(n=>n.family==='IPv4'&&!n.internal)?.address;
 if(!ip)throw new Error('No LAN IPv4 address found. Connect both devices to Wi-Fi.');
 return {ok:true,relay:'http://'+ip+':18765'};
}
const safeHttp = value => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } };
const send = (type,data) => {if(mainWindow && !mainWindow.isDestroyed())mainWindow.webContents.send('pynault:event',{type,...data});};
function configureSession(partition){
  const s=session.fromPartition(partition);
  if(s.__pynaultReady)return s;
  s.__pynaultReady=true;
  const allowedOrigins=new Set();
  s.setPermissionCheckHandler((_wc,permission,origin)=>{
    if(permission==='geolocation'&&locationBlocked)return false;
    return typeof origin==='string'&&allowedOrigins.has(origin+'|'+permission);
  });
  s.setPermissionRequestHandler((wc,permission,callback,details)=>{
    const allowed = ['media','geolocation','notifications','clipboard-read','fullscreen'].includes(permission);
    const url=details.requestingUrl || wc.getURL();
    if(!allowed || !safeHttp(url) || (permission==='geolocation'&&locationBlocked)){callback(false);return;}
    dialog.showMessageBox(mainWindow,{type:'question',buttons:['Block','Allow'],defaultId:0,cancelId:0,title:'Pynault site permission',message:`Allow ${new URL(url).hostname} to use ${permission}?`,detail:'Only approve websites you trust.'}).then(r=>{if(r.response===1)allowedOrigins.add(new URL(url).origin+'|'+permission);callback(r.response===1)}).catch(()=>callback(false));
  });
  s.webRequest.onBeforeRequest((details,callback)=>{
    if(!shieldEnabled || details.resourceType==='mainFrame'){callback({cancel:false});return;}
    try{
      const hostname=new URL(details.url).hostname.toLowerCase();
      const page=webContents.fromId(details.webContentsId)?.getURL()||'';
      let origin='';try{origin=new URL(page).hostname.toLowerCase()}catch{}
      const isOwn=!!origin && (hostname===origin || origin.endsWith('.'+hostname));
      const blocked=!isOwn && !siteExceptions.includes(origin) && blockedBy(hostname);
      if(blocked){blockedCount++;if(blockedCount%5===1)send('privacy-stats',{blockedCount})}
      callback({cancel:blocked});
    }catch{callback({cancel:false})}
  });
  s.on('will-download',(event,item)=>{
    const dir=app.getPath('downloads');let fname=path.basename(item.getFilename()).replace(/[<>:"/\\|?*\x00-\x1F]/g,'_')||'download';
    const ext=path.extname(fname),base=path.basename(fname,ext);let candidate=path.join(dir,fname),i=1;
    while(fs.existsSync(candidate)){candidate=path.join(dir,`${base} (${i++})${ext}`)}
    item.setSavePath(candidate);
    const downloadId=crypto.randomUUID();
    send('download',{id:downloadId,name:fname,status:'downloading',path:candidate});
    item.on('updated',()=>send('download',{id:downloadId,name:fname,status:'downloading',path:candidate,received:item.getReceivedBytes(),total:item.getTotalBytes()}));
    item.once('done',(_e,state)=>send('download',{id:downloadId,name:fname,status:state==='completed'?'completed':state,path:candidate}));
  });
  return s;
}
function tabById(id){const entry=tabs.get(id);if(!entry)throw new Error('Tab not found');return entry;}
function syncView(){
  if(!mainWindow || mainWindow.isDestroyed()) return;
  const next=contentVisible ? tabs.get(currentId)?.view ?? null : null;
  if(mountedView && mountedView!==next){
    mainWindow.contentView.removeChildView(mountedView);
    mountedView=null;
  }
  if(!next)return;
  if(mountedView!==next){
    mainWindow.contentView.addChildView(next);
    mountedView=next;
  }
  const area=mainWindow.getContentBounds();
  const x=Math.max(0,Math.min(area.width-1,Math.round(viewport.x)));
  const y=Math.max(0,Math.min(area.height-1,Math.round(viewport.y)));
  const width=Math.max(1,Math.min(Math.round(viewport.width),area.width-x));
  const height=Math.max(1,Math.min(Math.round(viewport.height),area.height-y));
  next.setBounds({x,y,width,height});
}
function attachEvents(id,view){
  const wc=view.webContents;
  const update=patch=>send('tab-update',{id,...patch});
  wc.on('did-start-loading',()=>update({loading:true,error:null}));
  wc.on('did-stop-loading',()=>{const current=wc.getURL();update({loading:false,...(safeHttp(current)?{url:current}:{}),canGoBack:wc.navigationHistory.canGoBack(),canGoForward:wc.navigationHistory.canGoForward()})});
  wc.on('page-title-updated',(_e,title)=>update({title}));
  wc.on('before-input-event',(event,input)=>{
    if(input.type!=='keyDown')return;
    const command=input.control || input.meta;
    const key=input.key.toLowerCase();
    if(command && ['l','t','w'].includes(key)){
      event.preventDefault();
      if(key==='l'){mainWindow.webContents.focus();send('shortcut',{name:'focus-address'});}
      else send('shortcut',{name:key==='t'?(input.shift?'reopen-tab':'new-tab'):'close-tab',id});
    }else if((input.alt && ['arrowleft','arrowright'].includes(key)) || key==='f5' || (command && key==='r')){
      event.preventDefault();
      browserAction({id,action:input.alt?(key==='arrowleft'?'back':'forward'):'reload'});
    }
  });
  wc.on('did-finish-load',()=>{
    if(!shieldEnabled)return;
    wc.insertCSS('.adsbygoogle, [data-ad-slot], [data-ad-client], .ad-banner, .advertisement, .advertisement-container {display:none!important}').catch(()=>{});
  });
  wc.on('page-favicon-updated' ,(_e,icons)=>update({favicon:icons[0]||''}));
  const navigate=(_e,url)=>{if(safeHttp(url))update({url,canGoBack:wc.navigationHistory.canGoBack(),canGoForward:wc.navigationHistory.canGoForward()})};
  wc.on('did-navigate',navigate);wc.on('did-navigate-in-page',navigate);
  wc.on('did-fail-load',(_e,code,description,url,isMain)=>{if(isMain && code!==-3)update({loading:false,error:`${description} (${code})`,...(safeHttp(url)?{url}:{})})});
  wc.on('will-navigate',(event,url)=>{if(!safeHttp(url))event.preventDefault()});
  wc.setWindowOpenHandler(({url})=>{if(safeHttp(url))send('open-url',{url});return {action:'deny'};});
}
function createTab({id,url,privateMode=false}){
  if(typeof id!=='string'||!id||id.length>128)throw new Error('Invalid tab id');
  if(tabs.has(id))return {ok:true};
  if(tabs.size>=40)throw new Error('Maximum of 40 simultaneous tabs in this MVP');
  if(url===HOME || !safeHttp(url)){tabs.set(id,{view:null,privateMode});return {ok:true};}
  const partition=privateMode?'pynault-private-session':'persist:pynault-browser';
  configureSession(partition);
  const view=new WebContentsView({webPreferences:{session:session.fromPartition(partition),sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true,backgroundThrottling:true}});
  tabs.set(id,{view,privateMode});attachEvents(id,view);
  view.webContents.loadURL(url).catch(error=>send('tab-update',{id,loading:false,error:error.message}));
  return {ok:true};
}
function ensureView(id,url){
  const t=tabById(id);
  if(t.view)return t.view;
  if(!safeHttp(url))return null;
  const partition=t.privateMode?'pynault-private-session':'persist:pynault-browser';
  configureSession(partition);
  const view=new WebContentsView({webPreferences:{session:session.fromPartition(partition),sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true}});
  t.view=view;attachEvents(id,view);return view;
}
function navigate(id,url){
  if(!safeHttp(url))throw new Error('Only HTTP(S) websites are supported');
  const view=ensureView(id,url);
  const promise=view.webContents.loadURL(url);
  promise.catch(error=>send('tab-update',{id,error:error.message,loading:false}));
  if(currentId===id)syncView();return {ok:true};
}
function destroyTab(id){const tab=tabs.get(id);if(!tab)return {ok:true};
  if(tab.view){if(mainWindow && !mainWindow.isDestroyed())mainWindow.contentView.removeChildView(tab.view);if(mountedView===tab.view)mountedView=null;if(!tab.view.webContents.isDestroyed())tab.view.webContents.close();}
  tabs.delete(id);if(currentId===id)currentId=null;syncView();
  if(tab.privateMode && ![...tabs.values()].some(t=>t.privateMode)){
    session.fromPartition('pynault-private-session').clearStorageData().catch(()=>{});
    session.fromPartition('pynault-private-session').clearCache().catch(()=>{});
  }
  return {ok:true};
}
function browserAction({id,action}){
 const t=tabById(id);const wc=t.view?.webContents;
 if(!wc)return {ok:false};
 if(action==='back'&&wc.navigationHistory.canGoBack())wc.navigationHistory.goBack();
 else if(action==='forward'&&wc.navigationHistory.canGoForward())wc.navigationHistory.goForward();
 else if(action==='reload')wc.reload();
 else if(action==='stop')wc.stop();
 else if(action==='devtools')wc.openDevTools({mode:'detach'});
 else if(action==='reader'){
   wc.executeJavaScript(`(()=>{let s=document.querySelector('#__pynault_reader');if(s){s.remove();return}else{s=document.createElement('style');s.id='__pynault_reader';s.textContent='body{max-width:860px!important;margin:30px auto!important;padding:30px!important;line-height:1.85!important;font-size:19px!important}header,footer,aside,nav,[role=banner],[role=complementary]{display:none!important}';document.documentElement.appendChild(s)}})()`,true).catch(()=>{});
 }
 else if(action==='screenshot'){
  const target=path.join(app.getPath('pictures'),`Pynault-${Date.now()}.png`);
  wc.capturePage().then(img=>fs.promises.writeFile(target,img.toPNG())).then(()=>send('toast',{message:'Screenshot saved to Pictures'})).catch(err=>send('toast',{message:err.message}));
 }
 return {ok:true};
}
function openDesktop(){
 mainWindow=new BrowserWindow({width:1440,height:900,minWidth:720,minHeight:580,backgroundColor:'#080d0d',frame:false,show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 mainWindow.on('resize',syncView);
 mainWindow.on('closed',()=>{for(const {view} of tabs.values()){try{if(view&&!view.webContents.isDestroyed())view.webContents.close()}catch{}}tabs.clear();mountedView=null;currentId=null;mainWindow=null});
 mainWindow.once('ready-to-show',()=>mainWindow.show());
 if(DEV)mainWindow.loadURL('http://127.0.0.1:5173');else mainWindow.loadFile(path.join(__dirname,'../../dist/index.html'));
}
app.whenReady().then(()=>{configureSession('persist:pynault-browser');configureSession('pynault-private-session');openDesktop();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)openDesktop()})});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
app.on('before-quit',()=>{if(relayServer)relayServer.close();});
const handlers={
 'create':(_,{id,url,privateMode})=>createTab({id,url,privateMode}),
 'navigate':(_,{id,url})=>navigate(id,url),
 'close':(_,{id})=>destroyTab(id),
 'activate':(_,{id})=>{tabById(id);currentId=id;syncView();return {ok:true}},
 'action':(_,payload)=>browserAction(payload),
 'viewport':(_,{rect,visible})=>{if(rect&&['x','y','width','height'].every(k=>Number.isFinite(rect[k])))viewport=rect;contentVisible=!!visible;syncView();return {ok:true}},
 'shield':(_,{enabled})=>{shieldEnabled=!!enabled;return {ok:true}},
 'location':(_,{blocked})=>{locationBlocked=!!blocked;return {ok:true}},
 'site-exceptions':(_,{hosts=[]})=>{siteExceptions=(Array.isArray(hosts)?hosts:[]).filter(h=>typeof h==='string'&&/^[a-z0-9.-]{1,253}$/.test(h)).slice(0,200);return {ok:true}},
 'privacy-stats':()=>({ok:true,blockedCount,locationBlocked,shieldEnabled}),
 'relay-start':async()=>startLocalRelay(),
 'window':(_,{action})=>{if(action==='minimize')mainWindow.minimize();if(action==='maximize'){if(mainWindow.isMaximized())mainWindow.unmaximize();else mainWindow.maximize()}if(action==='close')mainWindow.close();return {ok:true}},
 'downloads':async()=>{const error=await shell.openPath(app.getPath('downloads'));if(error)throw new Error(error);return {ok:true}},
 'clear-data':async()=>{
   for(const tab of tabs.values()){if(!tab.privateMode && tab.view)tab.view.webContents.navigationHistory.clear();}
   await session.fromPartition('persist:pynault-browser').clearCache();
   await session.fromPartition('persist:pynault-browser').clearStorageData({storages:['cookies','localstorage','indexdb','serviceworkers','cachestorage']});
   return {ok:true};
 }
};
for(const [name,handler] of Object.entries(handlers))ipcMain.handle('pynault:'+name,async(event,args={})=>{if(event.sender!==mainWindow?.webContents)throw new Error('Blocked caller');return handler(event,args)});
