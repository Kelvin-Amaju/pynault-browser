import React,{useState,useEffect,useLayoutEffect,useRef,useCallback} from 'react';
import {registerPlugin,Capacitor} from '@capacitor/core';
import {ArrowLeft,ArrowRight,RotateCw,X,Plus,Search,Shield,Download,Bookmark,History,Settings,Blocks,PanelLeftClose,PanelLeftOpen,Home,FolderClosed,ChevronRight,MoreHorizontal,Menu,Maximize2,Minus,ExternalLink,Check,Star,Clock3,Sun,Globe,Copy,EyeOff,PanelsTopLeft,LayoutGrid,Trash2,BookOpen,Camera,Sparkles,FileText,NotebookPen,Info,ShieldCheck,ArrowUpRight,LockKeyhole,CheckCheck,Square,ChevronDown,SlidersHorizontal,Command,Share2,AlertTriangle} from 'lucide-react';
import {HOME,isWeb,resolveAddress,siteLabel,SEARCH_ENGINES} from './navigation.js';
import {read,write} from './storage.js';
import {MAX_TABS,safeList,restoreTabs,nextAfterClose,recordVisit} from './browser-state.js';
import {BUNDLED_PLUGINS} from './plugins/registry.js';

const NATIVE=Capacitor.isNativePlatform();
const DESKTOP=window.pynault?.platform==='desktop';
const Native=NATIVE?registerPlugin('NativePages'):null;
const UI_LABELS={home:'New Tab',tabs:'Tabs',bookmarks:'Bookmarks',history:'History',downloads:'Downloads',plugins:'Plugins',settings:'Settings',notes:'Page Notes'};
const uid=()=>Math.random().toString(36).slice(2,11)+Date.now().toString(36);
const firstTab=()=>({id:uid(),url:HOME,title:'New Tab',privateMode:false,loading:false});
const QUICK=[{title:'YouTube',url:'https://www.youtube.com',color:'#f63237',letter:'▶'},{title:'GitHub',url:'https://github.com',color:'#fff',letter:'◉'},{title:'Notion',url:'https://notion.so',color:'#fff',letter:'N'},{title:'Figma',url:'https://figma.com',color:'#f68158',letter:'◈'},{title:'Google',url:'https://google.com',color:'#4285f4',letter:'G'},{title:'Reddit',url:'https://www.reddit.com',color:'#fa5825',letter:'●'}];
const PLUGIN_ICONS={shield:ShieldCheck,reader:BookOpen,notes:NotebookPen,focus:EyeOff,screenshot:Camera};
const PLUGINS=BUNDLED_PLUGINS.map(item=>({...item,desc:item.description,icon:PLUGIN_ICONS[item.id],desktopOnly:item.platforms.length===1&&item.platforms[0]==='desktop'}));
function Brand({compact=false}){return <div className={'brand '+(compact?'brand-compact':'')}><img src="./pynault-mark.png" alt="Pynault symbol"/>{!compact&&<div className="brand-words"><b>PYNAULT</b><small>Browse Beyond.</small></div>}</div>}
function GlyphButton({icon:Icon,label,onClick,active=false,disabled=false,className=''}){return <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={'glyph '+(active?'active ':'')+className}><Icon size={18} strokeWidth={1.85}/></button>}
function Fav({tab,sz=17}){const [broken,setBroken]=useState(false);useEffect(()=>setBroken(false),[tab?.favicon]);return tab?.favicon&&!broken?<img className="favicon" style={{width:sz,height:sz}} src={tab.favicon} onError={()=>setBroken(true)}/>:tab?.url===HOME?<img className="favicon" style={{width:sz,height:sz}} src="./pynault-mark.png"/>:<Globe size={sz} color="#b5ce9f"/>}
function Empty({icon:Icon,title,description}){return <div className="empty"><div className="empty-icon"><Icon size={27}/></div><h3>{title}</h3><p>{description}</p></div>}

export default function App(){
  const [tabs,setTabs]=useState(()=>restoreTabs(read('tabs',[]),firstTab));
  const [activeId,setActiveId]=useState(()=>read('active',null));
  const [bookmarks,setBookmarks]=useState(()=>safeList(read('bookmarks',[])));
  const [history,setHistory]=useState(()=>safeList(read('history',[])));
  const [downloads,setDownloads]=useState([]);
  const [closedTabs,setClosedTabs]=useState([]);
  const [notes,setNotes]=useState(()=>read('notes',{})||{});
  const [options,setOptions]=useState(()=>({...{sidebar:true,topTabs:true,widgets:true,shield:true,wallpaper:true,focus:false,searchEngine:'google'},...read('options',{})}));
  const [panel,setPanel]=useState(null);
  const [mobileMenu,setMobileMenu]=useState(false);
  const [address,setAddress]=useState('');
  const [noteDraft,setNoteDraft]=useState('');
  const [toast,setToast]=useState('');
  const [mobileTabFilter,setMobileTabFilter]=useState('all');
  const viewportRef=useRef(null);
  const tabsRef=useRef(tabs);tabsRef.current=tabs;
  const currentId=tabs.some(t=>t.id===activeId)?activeId:tabs[0]?.id;
  const tab=tabs.find(t=>t.id===currentId)||tabs[0];
  const pageOpen=tab && isWeb(tab.url) && !tab.error && !panel && !mobileMenu;
  const notify=(message)=>{setToast(message)};
  useEffect(()=>{const onKey=e=>{if(!(e.ctrlKey||e.metaKey)&&!e.altKey&&e.key!=='F5')return;const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&e.shiftKey&&k==='t'){e.preventDefault();reopenClosedTab()}else if((e.ctrlKey||e.metaKey)&&k==='l'){e.preventDefault();document.querySelector('.url-form input,.mobile-url input,.search-home input')?.focus()}else if((e.ctrlKey||e.metaKey)&&k==='t'){e.preventDefault();addTab()}else if((e.ctrlKey||e.metaKey)&&k==='w'){e.preventDefault();if(currentId)closeTab(currentId)}else if(e.altKey&&e.key==='ArrowLeft'){e.preventDefault();tabAction('back')}else if(e.key==='F5'){e.preventDefault();tabAction('reload')}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[currentId,tabs]);
  useEffect(()=>{if(!toast)return;const handle=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(handle)},[toast]);
  useEffect(()=>{write('tabs',tabs.filter(t=>!t.privateMode).map(({id,url,title})=>({id,url,title,privateMode:false})))},[tabs]);
  useEffect(()=>{if(currentId)write('active',currentId)},[currentId]);
  useEffect(()=>write('bookmarks',bookmarks),[bookmarks]);
  useEffect(()=>write('history',history.slice(0,300)),[history]);
  useEffect(()=>write('notes',notes),[notes]);
  useEffect(()=>write('options',options),[options]);
  useEffect(()=>setAddress(tab?.url===HOME?'':tab?.url||''),[tab?.url,tab?.id]);
  useEffect(()=>setNoteDraft(notes[tab?.url]||''),[notes,tab?.url]);
  const command=useCallback(async (name,payload={})=>{
    try{
      if(DESKTOP)return await window.pynault.request(name,payload);
      if(NATIVE)return await Native[name](payload);
      return {ok:false,demo:true};
    }catch(e){console.error(name,e);notify(e.message||'Browser action unavailable');return {ok:false,error:e.message};}
  },[]);
  useEffect(()=>{
    let cancelled=false, remove=()=>{};
    async function init(){
      if(DESKTOP){remove=window.pynault.onEvent(handleEvent)}
      else if(NATIVE){const listener=await Native.addListener('pageUpdate',handleEvent);if(cancelled)listener.remove();else remove=()=>listener.remove()}
      if(cancelled)return;
      for(const t of tabsRef.current)await command('create',{id:t.id,url:t.url,privateMode:t.privateMode});
      const active=tabsRef.current.find(t=>t.id===read('active',null))||tabsRef.current[0];
      if(active){setActiveId(active.id);await command('activate',{id:active.id})}
      await command('shield',{enabled:read('options',{}).shield??true});
    }
    init();return()=>{cancelled=true;remove()};
    function handleEvent(e){
      if(e.type==='tab-update'){
        setTabs(prev=>prev.map(t=>t.id===e.id?{...t,...Object.fromEntries(Object.entries(e).filter(([key])=>!['type','id'].includes(key)))}:t));
        if(e.url&&isWeb(e.url)){
          const t=tabsRef.current.find(x=>x.id===e.id);
          if(!t?.privateMode) setHistory(h=>recordVisit(h,{title:e.title||siteLabel(e.url),url:e.url,date:Date.now()}));
        }
      }
      if(e.type==='open-url'&&e.url){addTabRef.current(e.url)}
      if(e.type==='shortcut'){
        if(e.name==='focus-address'){requestAnimationFrame(()=>document.querySelector('.url-form input,.mobile-url input')?.focus());}
        if(e.name==='new-tab')addTabRef.current();
        if(e.name==='close-tab')closeTabRef.current(e.id);
        if(e.name==='reopen-tab')reopenTabRef.current();
      }
      if(e.type==='download')setDownloads(prev=>{const i=prev.findIndex(x=>x.id===e.id);return i===-1?[e,...prev]:prev.map(x=>x.id===e.id?{...x,...e}:x)});
      if(e.type==='toast')notify(e.message);
    }
  },[command]);
  const addTabRef=useRef(null);
  const closeTabRef=useRef(null);
  const reopenTabRef=useRef(null);
  function addTab(url=HOME,privateMode=false){if(tabsRef.current.length>=MAX_TABS){notify('Maximum 40 open tabs');return null;}if(privateMode&&NATIVE&&Capacitor.getPlatform()==='android'){notify('Private tabs are not yet available on Android');return null;}const newTab={id:uid(),url:resolveAddress(url,options.searchEngine),title:siteLabel(resolveAddress(url,options.searchEngine)),loading:false,privateMode};
    setTabs(ts=>[...ts,newTab]);setActiveId(newTab.id);setPanel(null);setMobileMenu(false);
    command('create',newTab).then(()=>command('activate',{id:newTab.id}));return newTab.id;}
  addTabRef.current=addTab;
  function activate(id){setActiveId(id);setPanel(null);setMobileMenu(false);command('activate',{id})}
  function closeTab(id){const closing=tabs.find(t=>t.id===id);if(closing&&!closing.privateMode)setClosedTabs(list=>[closing,...list].slice(0,10));const remaining=tabs.filter(t=>t.id!==id);if(!remaining.length){const fresh=firstTab();setTabs([fresh]);setActiveId(fresh.id);command('close',{id}).then(()=>command('create',fresh)).then(()=>command('activate',{id:fresh.id}));return}
    setTabs(remaining);command('close',{id});if(currentId===id){const nextId=nextAfterClose(tabs,id)||remaining[0].id;setActiveId(nextId);command('activate',{id:nextId})}}
  closeTabRef.current=closeTab;
  function reopenClosedTab(){if(!closedTabs.length)return;const recent=closedTabs[0];setClosedTabs(list=>list.slice(1));addTab(recent.url)}
  reopenTabRef.current=reopenClosedTab;
  function navigate(value){if(!tab)return;const url=resolveAddress(value,options.searchEngine);setPanel(null);setMobileMenu(false);setAddress(url===HOME?'':url);
    if(url===HOME){command('close',{id:tab.id}).then(()=>command('create',{id:tab.id,url:HOME,privateMode:tab.privateMode})).then(()=>command('activate',{id:tab.id}));setTabs(ts=>ts.map(t=>t.id===tab.id?{...t,url:HOME,title:'New Tab',loading:false}:t));return;}
    setTabs(ts=>ts.map(t=>t.id===tab.id?{...t,url,title:siteLabel(url),loading:true,error:null}:t));
    if(!tab.privateMode)setHistory(h=>recordVisit(h,{url,title:siteLabel(url),date:Date.now()}));
    if(!DESKTOP&&!NATIVE){window.open(url,'_blank','noopener,noreferrer');setTabs(ts=>ts.map(t=>t.id===tab.id?{...t,loading:false}:t));notify('Web preview: opened website in a new tab');return}
    command('navigate',{id:tab.id,url});}
  function tabAction(action){if(!tab)return;command('action',{id:tab.id,action});}
  function toggleBookmark(){if(!tab||!isWeb(tab.url))return;const has=bookmarks.some(b=>b.url===tab.url);setBookmarks(bs=>has?bs.filter(b=>b.url!==tab.url):[{id:uid(),title:tab.title||siteLabel(tab.url),url:tab.url,date:Date.now()},...bs]);notify(has?'Bookmark removed':'Bookmark saved')}
  function switchPanel(p){setMobileMenu(false);setPanel(old=>old===p?null:p)}
  function option(name,value){setOptions(o=>({...o,[name]:value}));if(name==='shield')command('shield',{enabled:value});}
  function pluginAction(id){if(!BUNDLED_PLUGINS.some(p=>p.id===id)){notify('Plugin not available');return;}if(id==='shield'&&NATIVE&&Capacitor.getPlatform()==='ios'){notify('Tracker blocking needs a native iOS content rule list');return}if(id==='notes'&&tab?.privateMode){notify('Page notes are disabled in private tabs');return}if(id==='shield'){option('shield',!options.shield);notify('Tracker Shield '+(!options.shield?'enabled':'disabled'));return}
    if(id==='focus'){option('focus',!options.focus);setPanel(null);return}
    if(id==='notes'){switchPanel('notes');return}
    if(!tab || !isWeb(tab.url)){notify('Open a website to use this plugin');return}
    if(!DESKTOP&&!NATIVE){notify('Open the installed Pynault browser to use page tools');return}
    if(id==='screenshot'&&!DESKTOP){notify('Screenshots are desktop-only in this release');return}
    tabAction(id==='reader'?'reader':'screenshot');if(id==='reader')notify('Reader mode toggled')}
  const updateViewport=useCallback(()=>{
    const r=viewportRef.current?.getBoundingClientRect();
    if(!r)return;
    command('viewport',{rect:{x:r.left,y:r.top,width:r.width,height:r.height},visible:!!(pageOpen && (DESKTOP||NATIVE))});
  },[command,pageOpen]);
  useLayoutEffect(()=>{updateViewport();const ob=new ResizeObserver(updateViewport);if(viewportRef.current)ob.observe(viewportRef.current);window.addEventListener('resize',updateViewport);return()=>{ob.disconnect();window.removeEventListener('resize',updateViewport)}},[updateViewport,options.sidebar,options.topTabs]);
  const clearSiteData=async()=>{if(!window.confirm('Clear saved website cookies and cached site data? You may be signed out of websites.'))return;if(DESKTOP){const result=await command('clear-data');if(!result?.ok)return;}setHistory([]);notify('Browsing data cleared');};
  const desktopNav=[{name:'Home',icon:Home,act:()=>navigate(HOME)},{name:'Spaces',icon:FolderClosed,act:()=>switchPanel('spaces')},{name:'Bookmarks',icon:Bookmark,act:()=>switchPanel('bookmarks')},{name:'History',icon:History,act:()=>switchPanel('history')},{name:'Downloads',icon:Download,act:()=>switchPanel('downloads')},{name:'Plugins',icon:Blocks,act:()=>switchPanel('plugins')},{name:'Settings',icon:Settings,act:()=>switchPanel('settings')}];
  const activeBookmark=bookmarks.some(b=>b.url===tab?.url);
  const isPrivate=!!tab?.privateMode;
  return <div className={'app '+(options.sidebar?'':'sidebar-collapsed ')+(options.focus?'focus-mode ':'')+(isPrivate?'private-mode ':'')+(options.wallpaper?'':'no-wallpaper ')}>
    <div className="desktop-sidebar">
      <div className="sb-brand"><Brand compact={!options.sidebar}/><GlyphButton icon={options.sidebar?PanelLeftClose:PanelLeftOpen} label="Toggle sidebar" onClick={()=>option('sidebar',!options.sidebar)}/></div>
      <button className="sb-new" onClick={()=>addTab()}><Plus size={17}/>{options.sidebar&&'New Tab'}</button>
      {options.sidebar&&<><span className="sb-caption">OPEN TABS</span><div className="sb-tabs">{tabs.slice(0,7).map(t=><button key={t.id} onClick={()=>activate(t.id)} className={'sb-tab '+(currentId===t.id?'selected':'')}><Fav tab={t}/><span>{t.title||siteLabel(t.url)}</span>{t.privateMode&&<EyeOff size={12}/>}</button>)}</div><span className="sb-caption space-label">SPACES <Plus size={14}/></span><div className="space-list"><div className="space active"><span className="space-dot"/>Personal</div><div className="space"><FolderClosed size={15}/>Work</div><div className="space"><FolderClosed size={15}/>Development</div></div></>}
      <div className="sb-navigation">{desktopNav.map(({name,icon:Icon,act})=><button title={name} onClick={act} key={name} className={'sb-link '+((name.toLowerCase()===panel)?'selected':'')}><Icon size={18}/>{options.sidebar&&name}</button>)}</div>
      {options.sidebar&&<div className="sb-footer"><div className="sb-badge"><Sparkles size={17}/><div><b>Browse Beyond.</b><small>Your space on the web.</small></div><ArrowUpRight size={14}/></div></div>}
    </div>
    <div className="workspace">
      <div className="desktop-header">
        <div className="tabs-line"><div className="drag-area"/>{options.topTabs&&<div className="top-tabs">{tabs.slice(0,12).map(t=><div key={t.id} className={'top-tab '+(currentId===t.id?'selected':'')}><button onClick={()=>activate(t.id)}><Fav tab={t} sz={15}/><span>{t.title||siteLabel(t.url)}</span></button><GlyphButton icon={X} label="Close tab" onClick={()=>closeTab(t.id)}/></div>)}</div>}<GlyphButton icon={Plus} label="New tab" onClick={()=>addTab()}/><div className="drag-tail"/><div className="window-controls"><GlyphButton icon={Minus} label="Minimize" onClick={()=>command('window',{action:'minimize'})}/><GlyphButton icon={Square} label="Maximize" onClick={()=>command('window',{action:'maximize'})}/><GlyphButton icon={X} label="Close window" onClick={()=>command('window',{action:'close'})}/></div></div>
        <div className="address-line"><GlyphButton icon={ArrowLeft} label="Back" disabled={!tab?.canGoBack} onClick={()=>tabAction('back')}/><GlyphButton icon={ArrowRight} label="Forward" disabled={!tab?.canGoForward} onClick={()=>tabAction('forward')}/><GlyphButton icon={tab?.loading?X:RotateCw} label={tab?.loading?'Stop':'Reload'} onClick={()=>tabAction(tab?.loading?'stop':'reload')}/><GlyphButton icon={Home} label="New tab home" onClick={()=>navigate(HOME)}/><form className="url-form" onSubmit={e=>{e.preventDefault();navigate(address)}}><Shield size={17} className="url-shield"/><input autoCorrect="off" spellCheck="false" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Search the web or enter a URL" aria-label="Address or search query"/><button type="submit" title="Go"><ArrowRight size={17}/></button></form><GlyphButton icon={activeBookmark?Star:Bookmark} label={activeBookmark?'Remove bookmark':'Bookmark page'} active={activeBookmark} onClick={toggleBookmark}/><GlyphButton icon={Download} label="Downloads" onClick={()=>switchPanel('downloads')}/><GlyphButton icon={Sparkles} label="Quick tools" onClick={()=>switchPanel('plugins')}/><button className="avatar" onClick={()=>switchPanel('settings')}>P</button><GlyphButton icon={MoreHorizontal} label="Menu" onClick={()=>switchPanel('settings')}/></div>
      </div>
      <div className="mobile-header">{tab?.url!==HOME?<><GlyphButton icon={ArrowLeft} label="Back" onClick={()=>tabAction('back')}/><form className="mobile-url" onSubmit={e=>{e.preventDefault();navigate(address)}}><LockKeyhole size={13}/><input value={address} onChange={e=>setAddress(e.target.value)} aria-label="Website address"/><button title="Go"><ArrowRight size={16}/></button></form><GlyphButton icon={RotateCw} label="Reload" onClick={()=>tabAction('reload')}/></>:<><button className="round-btn" onClick={()=>setMobileMenu(true)}><Menu size={19}/></button><Brand/><button className="round-btn" onClick={()=>switchPanel('settings')}><Settings size={19}/></button></>}</div>
      <div className={'browser-stage '+(tab?.url===HOME?'stage-home':'stage-web')} ref={viewportRef}>
        {tab?.url===HOME ? <div className="newtab-shell"><div className="wallpaper" aria-hidden="true"><div className="planet"/><div className="mountain m1"/><div className="mountain m2"/></div><div className="newtab-layout"><div className="start-content"><div className="start-brand"><img src="./pynault-mark.png"/><h1>PYNAULT</h1><span>B R O W S E &nbsp; B E Y O N D.</span><div className="lime-dash"/></div><form className="search-home" onSubmit={e=>{e.preventDefault();navigate(address)}}><Search size={20}/><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Search the web or enter a URL" aria-label="Search the web"/><button title="Search"><ArrowRight size={20}/></button></form><div className="shortcuts">{QUICK.map(q=><button className="shortcut" key={q.title} onClick={()=>navigate(q.url)}><span className="shortcut-icon" style={{color:q.color}}>{q.letter}</span><small>{q.title}</small></button>)}<button className="shortcut" onClick={()=>switchPanel('bookmarks')}><span className="shortcut-icon"><Plus size={25}/></span><small>Add</small></button></div><div className="home-tagline">A faster, calmer<br/>way to the web.<i/></div><div className="mobile-continue"><div className="section-head">CONTINUE BROWSING <button onClick={()=>switchPanel('history')}>See all <ArrowRight size={13}/></button></div><div className="continue-list">{history.slice(0,2).length?history.slice(0,2).map(h=><button onClick={()=>navigate(h.url)} key={h.id}><Globe size={16}/><span>{h.title}</span><ChevronRight size={14}/></button>):<p>Recent websites will appear here.</p>}</div></div></div>{options.widgets&&!options.focus&&<div className="right-rail"><div className="widget time-widget"><div><small>YOUR SPACE</small><h2>{new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</h2><span>{new Date().toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'})}</span></div><Sun size={25}/></div><div className="widget reading-widget"><div className="widget-header"><span><BookOpen size={15}/> Reading List</span><button onClick={()=>switchPanel('bookmarks')}>See all <ChevronRight size={13}/></button></div>{bookmarks.slice(0,3).length?bookmarks.slice(0,3).map(b=><button onClick={()=>navigate(b.url)} className="read-entry" key={b.id}><div className="read-thumb"><Globe size={17}/></div><span><b>{b.title}</b><small>{siteLabel(b.url)}</small></span><MoreHorizontal size={16}/></button>):<p className="widget-muted">Bookmark a page to see it here.</p>}</div><div className="widget promo-widget"><span>Browse Beyond.</span><p>A more private, focused internet made for you.</p><button onClick={()=>switchPanel('plugins')}><ArrowRight size={18}/></button></div></div>}</div></div> : <div className="web-placeholder">{(!DESKTOP&&!NATIVE)&&<div><Globe size={30}/><h3>{siteLabel(tab?.url)}</h3><p>Web preview opens sites in a separate browser tab. Use Electron or a native mobile build to browse inside Pynault.</p><button className="lime-btn" onClick={()=>window.open(tab?.url,'_blank','noopener,noreferrer')}>Open website <ExternalLink size={16}/></button></div>}{tab?.error&&<div className="page-error"><AlertTriangle size={22}/><b>Page could not be loaded</b><p>{tab.error}</p><button onClick={()=>tabAction('reload')}>Retry</button></div>}</div>}
      </div>
      <div className="mobile-nav"><GlyphButton icon={ArrowLeft} label="Back" onClick={()=>tabAction('back')}/><GlyphButton icon={ArrowRight} label="Forward" onClick={()=>tabAction('forward')}/><button onClick={()=>navigate(HOME)} className="mobile-home"><Home size={19}/></button><button onClick={()=>switchPanel('tabs')} className="tabs-count">{tabs.length}</button><GlyphButton icon={MoreHorizontal} label="Menu" onClick={()=>setMobileMenu(true)}/></div>
      {panel&&<div className="panel-layer"><div className="panel-overlay" onClick={()=>setPanel(null)}/><section className="side-panel"><div className="panel-heading"><div><small>PYNAULT BROWSER</small><h2>{UI_LABELS[panel]||panel[0].toUpperCase()+panel.slice(1)}</h2></div><GlyphButton icon={X} label="Close" onClick={()=>setPanel(null)}/></div><div className="panel-content">
        {panel==='tabs'&&<><div className="tabs-filters">{['all','regular','private'].map(f=><button className={mobileTabFilter===f?'selected':''} onClick={()=>setMobileTabFilter(f)} key={f}>{f==='all'?`All (${tabs.length})`:f==='regular'?'Open':'Private'}</button>)}</div><div className="tab-grid">{tabs.filter(t=>mobileTabFilter==='all'||(mobileTabFilter==='private' ? t.privateMode : !t.privateMode)).map(t=><div className={'tab-card '+(t.id===currentId?'selected':'')} key={t.id}><button className="tab-card-main" onClick={()=>activate(t.id)}><Fav tab={t}/><span>{t.title||siteLabel(t.url)}</span></button><button className="tab-card-close" onClick={()=>closeTab(t.id)}><X size={16}/></button><div className="tab-card-preview"><img src="./pynault-mark.png"/><small>{siteLabel(t.url)}</small></div></div>)}</div><div className="two-actions"><button className="lime-btn" onClick={()=>addTab()}><Plus size={17}/> New Tab</button><button className="dark-btn" onClick={()=>addTab(HOME,true)}><EyeOff size={16}/> Private</button></div></>}
        {panel==='bookmarks'&&<>{bookmarks.length?bookmarks.map(b=><div className="list-item" key={b.id}><div className="item-glyph"><Bookmark size={18}/></div><button onClick={()=>navigate(b.url)}><b>{b.title}</b><small>{b.url}</small></button><GlyphButton icon={X} label="Remove bookmark" onClick={()=>setBookmarks(list=>list.filter(x=>x.id!==b.id))}/></div>):<Empty icon={Bookmark} title="No bookmarks yet" description="Save your favorite sites with the bookmark icon."/>}</>}
        {panel==='history'&&<>{history.length?<><button className="quiet-action" onClick={()=>{setHistory([]);notify('Browsing history cleared')}}><Trash2 size={15}/> Clear history</button>{history.slice(0,100).map(h=><div className="list-item" key={h.id}><div className="item-glyph"><History size={18}/></div><button onClick={()=>navigate(h.url)}><b>{h.title}</b><small>{siteLabel(h.url)} · {new Date(h.date).toLocaleString()}</small></button></div>)}</>:<Empty icon={History} title="No history yet" description="Sites you browse normally will appear here."/>}</>}
        {panel==='downloads'&&<><button className="quiet-action" onClick={()=>command('downloads')}><FolderClosed size={15}/> Open downloads folder</button>{downloads.length?downloads.map(d=><div className="list-item" key={d.id}><div className="item-glyph"><Download size={18}/></div><div className="download-row"><b>{d.name}</b><small>{d.status} {d.total?Math.round(100*d.received/d.total)+'%':''}</small>{d.total&&d.status==='downloading'&&<progress value={d.received||0} max={d.total}/>}</div></div>):<Empty icon={Download} title="No downloads yet" description="Files downloaded in Pynault will appear here during this session."/>}</>}
        {panel==='plugins'&&<><p className="panel-intro">Built-in tools that improve your browsing experience. These are not third-party Chrome extensions.</p>{PLUGINS.map(({id,name,desc,icon:Icon,desktopOnly})=><div className="plugin-entry" key={id}><div className="plugin-icon"><Icon size={21}/></div><div><b>{name}</b><p>{desc}</p>{desktopOnly&&<small>Desktop functionality</small>}</div><button onClick={()=>pluginAction(id)} className={'plugin-action '+((id==='shield'&&options.shield)||(id==='focus'&&options.focus)?'enabled':'')}>{id==='shield'||id==='focus'?<span className="switch-track"/>: <ArrowUpRight size={17}/>}</button></div>)}</>}
        {panel==='settings'&&<><div className="setting-section"><h3>Appearance</h3>{[['sidebar','Expanded sidebar'],['topTabs','Horizontal tabs'],['widgets','Home page widgets'],['wallpaper','Background graphics']].map(([key,title])=><label className="setting-row" key={key}><span>{title}</span><input type="checkbox" checked={!!options[key]} onChange={e=>option(key,e.target.checked)}/><span className="switch-ui"/></label>)}</div><div className="setting-section"><h3>Privacy & security</h3><label className="setting-row"><span>Tracker Shield (basic)</span><input type="checkbox" checked={!!options.shield} onChange={e=>option('shield',e.target.checked)}/><span className="switch-ui"/></label><button className="setting-row text-row" onClick={()=>addTab(HOME,true)}><span>Open a private tab</span><ChevronRight size={17}/></button></div><div className="setting-section"><h3>Browser</h3><label className="setting-row"><span>Search engine</span><select className="search-select" value={options.searchEngine||'google'} onChange={e=>option('searchEngine',e.target.value)}>{Object.entries(SEARCH_ENGINES).map(([id,item])=><option key={id} value={id}>{item.label}</option>)}</select></label><button className="setting-row text-row" onClick={reopenClosedTab} disabled={!closedTabs.length}><span>Reopen recently closed tab</span><ChevronRight size={17}/></button>{DESKTOP&&<button className="setting-row text-row" onClick={clearSiteData}><span>Clear cookies and site data</span><Trash2 size={17}/></button>}<div className="setting-row"><span>Version</span><small>0.2.0 development</small></div><div className="setting-row"><span>Platform</span><small>{DESKTOP?'Electron Desktop':NATIVE?'Native Mobile':'Web Preview'}</small></div></div><p className="privacy-caption">Passwords, account sync, arbitrary plugins and hardened content blocking are not included in the current version.</p></>}
        {panel==='notes'&&<><p className="panel-intro">Notes are stored locally on this device for each URL.</p><span className="note-site">{tab?.url===HOME?'New tab':tab?.url}</span><textarea value={noteDraft} onChange={e=>setNoteDraft(e.target.value)} placeholder="Write a note about this page..."/><button className="lime-btn" onClick={()=>{setNotes(n=>({...n,[tab.url]:noteDraft}));notify('Note saved')}}>Save note <Check size={16}/></button></>}
        {panel==='spaces'&&<><p className="panel-intro">Spaces help organize your browser. Workspace-specific tab separation is planned for a later release.</p>{['Personal','Work','Development'].map(x=><div className="list-item" key={x}><div className="item-glyph"><FolderClosed size={17}/></div><b>{x}</b></div>)}</>}
      </div></section></div>}
      {mobileMenu&&<div className="menu-layer"><div className="panel-overlay" onClick={()=>setMobileMenu(false)}/><div className="mobile-drawer"><div className="drawer-grab"/><div className="drawer-brand"><Brand/><GlyphButton icon={X} label="Close menu" onClick={()=>setMobileMenu(false)}/></div><div className="drawer-grid">{[{icon:Plus,title:'New Tab',do:()=>addTab()},{icon:EyeOff,title:'Private Tab',do:()=>addTab(HOME,true)},{icon:Bookmark,title:'Bookmarks',do:()=>switchPanel('bookmarks')},{icon:History,title:'History',do:()=>switchPanel('history')},{icon:Download,title:'Downloads',do:()=>switchPanel('downloads')},{icon:Blocks,title:'Plugins',do:()=>switchPanel('plugins')},{icon:BookOpen,title:'Reader Mode',do:()=>{setMobileMenu(false);pluginAction('reader')}},{icon:Settings,title:'Settings',do:()=>switchPanel('settings')}].map(({icon:Icon,title,do:fn})=><button onClick={fn} key={title}><Icon size={23}/><span>{title}</span></button>)}</div><div className="drawer-bottom"><button onClick={()=>{setMobileMenu(false);notify('Use the website sharing menu or copy its URL')}}><Share2 size={17}/> Share Page <ChevronRight size={16}/></button><button onClick={()=>{setMobileMenu(false);navigator.clipboard?.writeText(tab?.url||'').then(()=>notify('URL copied'))}}><Copy size={17}/> Copy URL <ChevronRight size={16}/></button></div></div></div>}
      {isPrivate&&<div className="private-indicator"><EyeOff size={13}/> Private</div>}
      {toast&&<div className="toast"><CheckCheck size={18}/>{toast}</div>}
    </div>
  </div>
}
