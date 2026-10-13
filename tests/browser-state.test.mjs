import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreTabs,nextAfterClose,recordVisit,safeList,MAX_TABS,HISTORY_LIMIT} from '../src/browser-state.js';
import {HOME} from '../src/navigation.js';
const fresh=()=>({id:'fresh',url:HOME,title:'New Tab',privateMode:false});
test('restores default tab from missing state',()=>assert.deepEqual(restoreTabs(null,fresh),[fresh()]));
test('restores valid tabs only',()=>{
  const source=[{id:'one',url:'https://example.com',title:'Example'},{id:'one',url:'https://duplicate.com'},{id:'priv',url:HOME,privateMode:true},{id:'file',url:'file:///etc/passwd'},null];
  assert.deepEqual(restoreTabs(source,fresh).map(t=>t.id),['one']);
});
test('restore maximum tab limit',()=>{
  const source=Array.from({length:60},(_,i)=>({id:String(i),url:'https://example.com'}));
  assert.equal(restoreTabs(source,fresh).length,MAX_TABS);
});
test('restores title from hostname when missing',()=>assert.equal(restoreTabs([{id:'a',url:'https://www.example.com'}],fresh)[0].title,'example.com'));
test('prevents invalid tab list throwing',()=>assert.deepEqual(safeList({}),[]));
test('close active middle tab selects previous tab',()=>assert.equal(nextAfterClose([{id:'a'},{id:'b'},{id:'c'}],'b'),'a'));
test('close first tab selects next tab',()=>assert.equal(nextAfterClose([{id:'a'},{id:'b'}],'a'),'b'));
test('close only tab returns null',()=>assert.equal(nextAfterClose([{id:'a'}],'a'),null));
test('history rejects non-http urls',()=>assert.equal(recordVisit([],{url:'javascript:foo',date:1}).length,0));
test('history de-duplicates consecutive urls',()=>{
  const first=recordVisit([],{url:'https://example.com',date:1});
  assert.equal(recordVisit(first,{url:'https://example.com',date:2}).length,1);
});
test('history remains bounded',()=>{
  const history=Array.from({length:HISTORY_LIMIT+30},(_,i)=>({url:'https://example.com/'+i,date:i}));
  assert.equal(recordVisit(history,{url:'https://example.org',date:900}).length,HISTORY_LIMIT);
});
