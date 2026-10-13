/** Optional self-hostable HTTPS-behind-proxy encrypted Pynault link relay.
 * Stores encrypted link messages; never receives the device encryption key.
 */
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const rooms=new Map();const LIMIT_BYTES=4096,MAX_MESSAGES=100,TTL=24*60*60*1000;
const validRoom=id=>/^[a-f0-9]{32}$/.test(id||'');
const current=()=>Date.now();
const gc=()=>{for(const [id,data] of rooms){data.messages=data.messages.filter(m=>current()-m.time<TTL);if(current()-data.used>TTL)rooms.delete(id)}};
export function createRelayServer({port=8787,host='127.0.0.1',corsOrigin='*'}={}){
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin',corsOrigin);res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  const send=(status,obj)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(obj))};
  if(req.method==='OPTIONS')return send(200,{ok:true});
  const pathname=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`).pathname;
  if(pathname==='/health')return send(200,{ok:true,service:'pynault-relay'});
  const match=pathname.match(/^\/v1\/rooms\/([a-f0-9]{32})(?:\/messages)?$/);
  if(!match)return send(404,{error:'Not found'});
  const roomId=match[1];if(!validRoom(roomId))return send(400,{error:'Invalid room'});
  gc();let room=rooms.get(roomId);
  if(req.method==='POST'){
   let bytes=0,text='';
   for await(const chunk of req){bytes+=chunk.length;if(bytes>LIMIT_BYTES)return send(413,{error:'Message too large'});text+=chunk}
   let payload;try{payload=JSON.parse(text)}catch{return send(400,{error:'Invalid payload'})}
   if(typeof payload.iv!=='string'||!/^[A-Za-z0-9_-]{16}$/.test(payload.iv)||typeof payload.data!=='string'||!/^[A-Za-z0-9_-]{1,4000}$/.test(payload.data))return send(400,{error:'Encrypted payload required'});
   if(!room){room={used:current(),messages:[],counter:0};rooms.set(roomId,room)}
   room.used=current();const id=++room.counter;room.messages.push({id,time:current(),iv:payload.iv,data:payload.data});if(room.messages.length>MAX_MESSAGES)room.messages.shift();
   return send(201,{ok:true,id});
  }
  if(req.method==='GET'){
   const after=Number(new URL(req.url,`http://${req.headers.host||'localhost'}`).searchParams.get('after')||0);
   if(!Number.isSafeInteger(after)||after<0)return send(400,{error:'Invalid cursor'});
   if(!room)return send(200,{messages:[],cursor:after});
   room.used=current();const entries=room.messages.filter(m=>m.id>after).slice(0,25);
   return send(200,{messages:entries,cursor:entries.length?entries.at(-1).id:after});
  }
  return send(405,{error:'Method not allowed'});
 });
 server.listen(port,host);return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||8787),host=process.env.HOST||'127.0.0.1',corsOrigin=process.env.CORS_ORIGIN||'*';
 createRelayServer({port,host,corsOrigin});console.log(`Pynault encrypted relay listening on ${host}:${port} (deploy behind HTTPS)`);
}
