import {test} from 'node:test';import assert from 'node:assert/strict';
import {createRelayServer} from '../services/link-relay/server.mjs';
test('relay accepts encrypted packets and advances cursor',async()=>{
 const server=createRelayServer({port:0});await new Promise(r=>server.once('listening',r));
 try{const origin='http://127.0.0.1:'+server.address().port;const room='c'.repeat(32);const path=origin+'/v1/rooms/'+room+'/messages';
  const payload={iv:'a'.repeat(16),data:'b'.repeat(25)};
  const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});assert.equal(r.status,201);
  const out=await (await fetch(path+'?after=0')).json();assert.equal(out.messages.length,1);assert.equal(out.cursor,1);
  const next=await(await fetch(path+'?after=1')).json();assert.equal(next.messages.length,0);
  const bad=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url:'https://secret'})});assert.equal(bad.status,400);
 }finally{server.close()}
});
