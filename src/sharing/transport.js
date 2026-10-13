import {encryptMessage,decryptMessage,validateSharedUrl} from './crypto.js';
const guard=(p)=>{if(!p?.relay||!p?.room||!p?.key)throw Error('Pair a device first')};
const endpoint=p=>new URL(`/v1/rooms/${p.room}/messages`,p.relay).toString();
export async function sendLink(pair,url,from='Pynault'){
 guard(pair);const clean=validateSharedUrl(url),payload=await encryptMessage(pair,{type:'link',url:clean,from,time:Date.now()});
 const response=await fetch(endpoint(pair),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw Error('Device relay unavailable ('+response.status+')');return response.json();
}
export async function getLinks(pair,cursor=0){
 guard(pair);const response=await fetch(endpoint(pair)+'?after='+cursor,{signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw Error('Device relay unavailable ('+response.status+')');
 const data=await response.json(),items=[];
 for(const r of data.messages||[]){try{const m=await decryptMessage(pair,r);if(m.type==='link')items.push({...m,id:r.id,url:validateSharedUrl(m.url)})}catch{/* Ignore unrelated or malicious ciphertext */}}
 return {items,cursor:data.cursor||cursor};
}
