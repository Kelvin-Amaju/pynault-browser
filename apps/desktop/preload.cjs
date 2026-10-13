const {contextBridge,ipcRenderer}=require('electron');
const channels=new Set(['create','navigate','close','activate','action','viewport','shield','location','site-exceptions','privacy-stats','relay-start','window','downloads','clear-data']);
contextBridge.exposeInMainWorld('pynault',{platform:'desktop',request:(name,payload={})=>{
  if(!channels.has(name))return Promise.reject(new Error('Blocked operation'));
  return ipcRenderer.invoke('pynault:'+name,payload);
},onEvent:(fn)=>{if(typeof fn!=='function')return ()=>{};
  const handler=(_e,packet)=>fn(packet);
  ipcRenderer.on('pynault:event',handler);
  return ()=>ipcRenderer.removeListener('pynault:event',handler);
}});
