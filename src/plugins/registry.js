/** Pynault trusted first-party extension registry.
 * External executable extensions are intentionally NOT supported in v0.2.
 * The app owns and vets every callable action; remote page content cannot call these actions.
 */
export const PLUGIN_PERMISSIONS=Object.freeze(['browser.tabs.active','browser.page.reader','browser.page.screenshot','browser.notes','browser.privacy','browser.ui','browser.page.share','browser.devices','browser.permissions.location']);
export const BUNDLED_PLUGINS=Object.freeze([
  {id:'shield',name:'Ad & Tracker Blocker',description:'Block known ad networks and analytics endpoints on desktop, Android and iOS.',permissions:['browser.privacy'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'location',name:'Location Guard',description:'Deny website location requests by default, with a privacy toggle.',permissions:['browser.permissions.location'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'share',name:'Website QR Codes',description:'Generate a QR for a page and scan QR links on mobile.',permissions:['browser.page.share'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'devices',name:'Device Link',description:'Pair devices using QR and send encrypted page links.',permissions:['browser.devices'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'reader',name:'Reader Mode',description:'Simplifies an article’s layout on the active webpage.',permissions:['browser.tabs.active','browser.page.reader'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'notes',name:'Page Notes',description:'Save notes locally for the current website.',permissions:['browser.tabs.active','browser.notes'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'focus',name:'Focus Mode',description:'Reduce browser UI distractions.',permissions:['browser.ui','browser.page.share','browser.devices','browser.permissions.location'],platforms:['desktop','android','ios'],version:'0.3.0'},
  {id:'screenshot',name:'Page Screenshot',description:'Save a picture of the current webpage.',permissions:['browser.tabs.active','browser.page.screenshot'],platforms:['desktop'],version:'0.3.0'}
]);
export function validatePluginManifest(manifest){
  if(!manifest||typeof manifest!=='object')return {ok:false,reason:'Missing manifest'};
  if(!/^[a-z][a-z0-9-]{1,49}$/.test(manifest.id||''))return {ok:false,reason:'Invalid plugin ID'};
  if(typeof manifest.name!=='string'||manifest.name.length<2||manifest.name.length>80)return {ok:false,reason:'Invalid plugin name'};
  if(!/^\d+\.\d+\.\d+$/.test(manifest.version||''))return {ok:false,reason:'Invalid plugin version'};
  if(!Array.isArray(manifest.permissions)||manifest.permissions.some(p=>!PLUGIN_PERMISSIONS.includes(p)))return {ok:false,reason:'Unknown capability requested'};
  if(!Array.isArray(manifest.platforms)||manifest.platforms.length===0||manifest.platforms.some(p=>!['desktop','android','ios'].includes(p)))return {ok:false,reason:'Unknown target platform'};
  return {ok:true};
}
export function availablePlugins(platform){return BUNDLED_PLUGINS.filter(p=>p.platforms.includes(platform))}
