import {test} from 'node:test';import assert from 'node:assert/strict';
import {generatePair,parsePairUrl,encryptMessage,decryptMessage,validateSharedUrl} from '../src/sharing/crypto.js';
import {createRelayServer} from '../services/link-relay/server.mjs';
import {sendLink,getLinks} from '../src/sharing/transport.js';
import {webcrypto} from 'node:crypto';
globalThis.crypto ||= webcrypto;
test('generated pair round trips safely through QR link',async()=>{
 const pair=await generatePair('https://sync.example.com');const parsed=parsePairUrl(pair.qr);assert.equal(parsed.key,pair.key);assert.equal(parsed.room,pair.room);assert.equal(parsed.relay,'https://sync.example.com');
});
test('encrypted messages decrypt only with matching key',async()=>{
 const pair=await generatePair('https://sync.example.com');const cipher=await encryptMessage(pair,{url:'https://example.com'});assert.deepEqual(await decryptMessage(pair,cipher),{url:'https://example.com'});
 const different=await generatePair('https://sync.example.com');await assert.rejects(()=>decryptMessage(different,cipher));
});
test('rejects invalid pairing payloads and unsafe URL protocols',()=>{assert.throws(()=>parsePairUrl('https://sync.example.com/#pynault=%7B%7D'));assert.throws(()=>validateSharedUrl('file:///etc/passwd'));assert.throws(()=>validateSharedUrl('https://user:pass@example.com'))});
test('devices send and receive through encrypted relay',async()=>{
 const server=createRelayServer({port:0});await new Promise(r=>server.once('listening',r));
 try{
  const pair=await generatePair('http://127.0.0.1:'+server.address().port);
  await sendLink(pair,'https://example.org/hello','Desktop');
  const {items,cursor}=await getLinks(pair);assert.equal(items.length,1);assert.equal(items[0].url,'https://example.org/hello');assert.equal(items[0].from,'Desktop');
  assert.equal((await getLinks(pair,cursor)).items.length,0);
 }finally{server.close()}
});
