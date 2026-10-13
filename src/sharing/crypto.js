/** Browser AES-GCM channel encryption; relay stores opaque ciphertext only. */
export function parsePairUrl(value){
 const url=new URL(value); if(!['https:','http:'].includes(url.protocol))throw Error('Invalid pairing QR');
 if(!url.hash.startsWith('#pynault='))throw Error('Not a Pynault pairing code');
 const data=JSON.parse(decodeURIComponent(url.hash.slice('#pynault='.length)));
 if(!/^[a-f\d]{32}$/.test(data.room||'') || !/^[A-Za-z0-9_-]{43}$/.test(data.key||''))throw Error('Pairing code is invalid');
 return {...data,relay:url.origin};
}
export const bytesToB64Url=arr=>btoa(String.fromCharCode(...arr)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');
export const b64UrlToBytes=str=>Uint8Array.from(atob(str.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-str.length%4)%4)),c=>c.charCodeAt(0));
export async function generatePair(relay){
 const secret=new Uint8Array(32);crypto.getRandomValues(secret);
 const room=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
 const key=bytesToB64Url(secret);
 const origin=new URL(relay).origin;
 if(!['http:','https:'].includes(new URL(origin).protocol))throw Error('Use HTTP(S) relay');
 return {room,key,relay:origin,qr:origin+'/#pynault='+encodeURIComponent(JSON.stringify({room,key}))};
}
async function importKey(key){return crypto.subtle.importKey('raw',b64UrlToBytes(key),'AES-GCM',false,['encrypt','decrypt'])}
export async function encryptMessage(pair,message){
 const iv=crypto.getRandomValues(new Uint8Array(12));const value=new TextEncoder().encode(JSON.stringify(message));
 const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await importKey(pair.key),value));
 return {iv:bytesToB64Url(iv),data:bytesToB64Url(encrypted)};
}
export async function decryptMessage(pair,record){
 const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64UrlToBytes(record.iv)},await importKey(pair.key),b64UrlToBytes(record.data));
 return JSON.parse(new TextDecoder().decode(raw));
}
export function validateSharedUrl(raw){const u=new URL(raw);if(!['http:','https:'].includes(u.protocol))throw Error('The shared item is not a web link');if(u.username||u.password)throw Error('Credential-bearing links are not allowed');return u.href}
