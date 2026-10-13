export const HOME='pynault://newtab';
export const SEARCH_ENGINES={
  google:{label:'Google',url:'https://www.google.com/search?q='},
  duckduckgo:{label:'DuckDuckGo',url:'https://duckduckgo.com/?q='},
  bing:{label:'Bing',url:'https://www.bing.com/search?q='},
  brave:{label:'Brave Search',url:'https://search.brave.com/search?q='}
};
export const SEARCH=SEARCH_ENGINES.google.url;
const IP4=/^(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?(?:[/?#]\S*)?$/;
const DOMAIN=/^[\w-]+(?:\.[\w-]+)+(?:\:\d{1,5})?(?:[/?#]\S*)?$/i;
const LOCAL=/^(?:localhost|127\.0\.0\.1)(?::\d{1,5})?(?:[/?#]\S*)?$/i;
export function isWeb(value){
  try{const u=new URL(value);return ['https:','http:'].includes(u.protocol) && !!u.hostname}catch{return false}
}
export function resolveAddress(value,engine='google'){
  const v=String(value??'').trim();
  if(!v||v===HOME||v==='about:blank')return HOME;
  if(/^https?:\/\//i.test(v)){
    try{const u=new URL(v);if(isWeb(u.href))return u.href}catch{}
  }
  if(LOCAL.test(v))return 'http://'+v;
  if(DOMAIN.test(v)||IP4.test(v))return 'https://'+v;
  return (SEARCH_ENGINES[engine]||SEARCH_ENGINES.google).url+encodeURIComponent(v);
}
export function siteLabel(url){if(!url||url===HOME)return 'New Tab';try{return new URL(url).hostname.replace(/^www\./,'')||'New Tab'}catch{return 'New Tab'}}
