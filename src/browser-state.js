import {HOME,isWeb,siteLabel} from './navigation.js';
export const MAX_TABS=40;
export const HISTORY_LIMIT=300;
export function safeList(value){return Array.isArray(value)?value:[]}
export function restoreTabs(stored,createDefault){
  const active=new Set();
  const tabs=[];
  for(const tab of safeList(stored)){
    if(!tab||typeof tab.id!=='string'||!tab.id||active.has(tab.id)||tab.privateMode)continue;
    if(tab.url!==HOME && !isWeb(tab.url))continue;
    tabs.push({id:tab.id,url:tab.url,title:typeof tab.title==='string'?tab.title:siteLabel(tab.url),privateMode:false,loading:false});
    active.add(tab.id);
    if(tabs.length>=MAX_TABS)break;
  }
  return tabs.length?tabs:[createDefault()];
}
export function nextAfterClose(tabs,closedId){
  const index=tabs.findIndex(t=>t.id===closedId);
  if(index<0)return tabs[0]?.id??null;
  return tabs.filter(t=>t.id!==closedId)[Math.max(0,index-1)]?.id??null;
}
export function recordVisit(history,{url,title,date}){
  if(!isWeb(url))return safeList(history).slice(0,HISTORY_LIMIT);
  const list=safeList(history);
  if(list[0]?.url===url)return list;
  return [{id:`visit-${date}-${Math.random().toString(36).slice(2)}`,url,title:title||siteLabel(url),date},...list].slice(0,HISTORY_LIMIT);
}
