import React,{useState,useEffect} from 'react';
import QRCode from 'qrcode';
import {CapacitorBarcodeScanner} from '@capacitor/barcode-scanner';
import {QrCode,ScanLine,Link2,Send,Smartphone,Monitor,Copy,Unplug,RefreshCw,ArrowUpRight,ShieldCheck} from 'lucide-react';
import {generatePair,parsePairUrl,validateSharedUrl} from './crypto.js';
import {sendLink} from './transport.js';

function QrImage({value}){
 const [src,setSrc]=useState('');
 useEffect(()=>{let live=true;setSrc('');if(value)QRCode.toDataURL(value,{margin:2,width:330,errorCorrectionLevel:'M',color:{dark:'#101818',light:'#ffffff'}}).then(data=>{if(live)setSrc(data)}).catch(()=>{});return()=>{live=false}},[value]);
 return src?<img className="pynault-qr" src={src} alt="QR code for the selected website or device pairing"/>:<div className="qr-wait"><QrCode size={45}/></div>;
}
export default function ShareCenter({mode,siteUrl,pair,setPair,onOpen,onNotice,command,isDesktop,isNative,privateMode,inbox=[]}){
 const [input,setInput]=useState(''),[newPair,setNewPair]=useState(null),[busy,setBusy]=useState(false),[relayOverride,setRelayOverride]=useState('');
 const [tab,setTab]=useState(mode==='devices'?'pair':'site');
 useEffect(()=>{setTab(mode==='devices'?'pair':'site')},[mode]);
 const pairingCode=pair?.room&&pair?.key&&pair?.relay?pair.relay+'/#pynault='+encodeURIComponent(JSON.stringify({room:pair.room,key:pair.key})):'';
 const qrSource=tab==='pair'?(newPair?.qr||pairingCode):siteUrl;
 async function createPair(){
  setBusy(true);try{
   let relay='';
   if(isDesktop){if(relayOverride.trim()){const u=new URL(relayOverride.trim());if(u.protocol!=='https:')throw Error('Remote relays must use HTTPS');relay=u.origin}else{const info=await command('relay-start');if(!info?.relay)throw Error('Could not start nearby sharing on this PC');relay=info.relay}}
   else {relay=window.prompt('Enter the HTTPS URL of your Pynault relay server (or pair by scanning the desktop QR):','')?.trim();if(!relay)return}
   const next=await generatePair(relay);setPair({room:next.room,key:next.key,relay:next.relay});setNewPair(next);
   onNotice('Pairing code ready. Scan it using Pynault on your other device.');
  }catch(e){onNotice(e.message)}finally{setBusy(false)}
 }
 async function scanCode(){
  try{const result=await CapacitorBarcodeScanner.scanBarcode({hint:0,scanInstructions:'Scan a Pynault link or pairing QR code'});
   if(result?.ScanResult)handleCode(result.ScanResult);
  }catch(e){onNotice('Camera scanner unavailable: '+(e.message||'paste the QR contents instead'))}
 }
 function handleCode(raw){
  try{
   if(raw.includes('#pynault=')){const info=parsePairUrl(raw);setPair({room:info.room,key:info.key,relay:info.relay});setNewPair(null);onNotice('Devices paired. Links can now be exchanged.');setTab('pair');return}
   const url=validateSharedUrl(raw);onOpen(url);onNotice('QR link opened in Pynault');
  }catch(e){onNotice(e.message)}
 }
 async function sendCurrent(){if(!pair){onNotice('Pair a second device first');setTab('pair');return}
  if(privateMode){onNotice('Sharing is disabled in private tabs');return}
  setBusy(true);try{await sendLink(pair,siteUrl,isDesktop?'Pynault Desktop':'Pynault Mobile');onNotice('Encrypted link sent to paired devices')}catch(e){onNotice(e.message)}finally{setBusy(false)}
 }
 const canShare=!!siteUrl && /^https?:\/\//i.test(siteUrl);
 return <div className="pynault-share">
  <div className="share-tabbar"><button className={tab==='site'?'active':''} onClick={()=>setTab('site')}><QrCode size={16}/> Website QR</button><button className={tab==='pair'?'active':''} onClick={()=>setTab('pair')}><Link2 size={16}/> Paired devices</button></div>
  {tab==='site'?<>
   <p className="panel-intro">Open this site on your phone. Scan with Pynault or any QR reader — no account needed.</p>
   {canShare?<><div className="qr-card"><QrImage value={siteUrl}/><span className="qr-card-label">SCAN TO OPEN THIS PAGE</span></div><div className="share-url">{siteUrl}</div><div className="share-actions"><button className="lime-btn" onClick={sendCurrent} disabled={busy||privateMode}><Send size={16}/> Send to paired device</button><button className="dark-btn" onClick={()=>navigator.clipboard?.writeText(siteUrl).then(()=>onNotice('Link copied')).catch(()=>onNotice('Copy is unavailable'))}><Copy size={16}/> Copy</button></div></>:<div className="share-empty">Open a website to generate its QR code.</div>}
   <div className="share-mini"><ShieldCheck size={17}/> Your page URL is encoded locally. It is not uploaded to a QR service.</div>
  </>:<>
   <div className="device-pair-art"><Monitor size={31}/><Link2 size={22}/><Smartphone size={30}/></div>
   <h3>Desktop and mobile, connected.</h3><p className="panel-intro">Send links in either direction. Pair by scanning the desktop code while both devices share a Wi-Fi network. Link contents are encrypted before reaching the relay.</p>
   {isDesktop&&pair&&<div className="qr-card"><QrImage value={qrSource}/><span className="qr-card-label">SCAN IN PYNAULT MOBILE TO PAIR</span></div>}
   {pair&&<div className="paired-status"><span className="online-dot"/><div><b>Device channel configured</b><small>{pair.relay.replace(/^https?:\/\//,'')}</small></div><button onClick={()=>{setPair(null);setNewPair(null);onNotice('Device channel disconnected')}} title="Disconnect"><Unplug size={18}/></button></div>}
   {isDesktop&&<div className="pair-manual"><label>Optional: HTTPS relay URL for sharing across different Wi-Fi networks</label><div className="pair-field"><input value={relayOverride} onChange={e=>setRelayOverride(e.target.value)} placeholder="Leave blank to pair over local Wi-Fi"/></div></div>}
   {isDesktop?<button className="lime-btn pair-button" onClick={createPair} disabled={busy}><QrCode size={17}/>{pair?'Generate a new pairing code':'Enable nearby sharing & create pairing QR'}</button>:<button className="lime-btn pair-button" onClick={scanCode}><ScanLine size={17}/> Scan desktop pairing code</button>}
   <div className="pair-manual"><label>Or paste a QR link / pairing code</label><div className="pair-field"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="https://..."/><button onClick={()=>{handleCode(input);setInput('')}}>Open</button></div></div>
   <div className="device-inbox"><h4>Received links <span>{inbox.length}</span></h4>{inbox.length?inbox.slice(0,12).map(x=><button key={x.id} onClick={()=>onOpen(x.url)}><ArrowUpRight size={16}/><span>{x.url}<small>{x.from} · {new Date(x.time).toLocaleTimeString()}</small></span></button>):<p>Links shared from your other device will appear here.</p>}</div>
  </>}
  {(isNative||!isDesktop)&&<div className="scan-section"><button className="dark-btn" onClick={scanCode}><ScanLine size={18}/> Scan a website QR code</button></div>}
 </div>;
}
