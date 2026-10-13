/** Local, auditable first-party ad/tracker rules. Never blocks main-frame navigation. */
export const AD_HOSTS = Object.freeze([
 'doubleclick.net','googleadservices.com','googlesyndication.com','adservice.google.com','pagead2.googlesyndication.com','partner.googleadservices.com',
 'ads-twitter.com','adsrvr.org','adnxs.com','criteo.com','criteo.net','outbrain.com','taboola.com','rubiconproject.com',
 'pubmatic.com','openx.net','indexww.com','bidswitch.net','casalemedia.com','smartadserver.com','lijit.com','yieldmo.com','sharethrough.com',
 'triplelift.com','sovrn.com','advertising.com','amazon-adsystem.com','media.net','revcontent.com','adform.net','adsafeprotected.com',
 'moatads.com','spotxchange.com','teads.tv','gumgum.com','richaudience.com','districtm.io','33across.com','undertone.com',
 'contextweb.com','exelator.com','adroll.com','quantserve.com','zedo.com','bidr.io','rtbhouse.com','adzerk.net','tribalfusion.com',
 'adskeeper.co.uk','popads.net','propellerads.com','propeller-tracking.com','adsterra.com','trafficjunky.net','mgid.com',
 'servedbyopenx.com','aniview.com','adthrive.com','mediavine.com','adpushup.com','nitropay.com','adlightning.com'
]);
export const TRACKER_HOSTS = Object.freeze([
 'google-analytics.com','googletagmanager.com','analytics.google.com','facebook.net','connect.facebook.net','pixel.facebook.com',
 'hotjar.com','static.hotjar.com','bat.bing.com','clarity.ms','segment.io','segment.com','mixpanel.com','amplitude.com',
 'fullstory.com','mouseflow.com','inspectlet.com','crazyegg.com','heap.io','heapanalytics.com','matomo.cloud','newrelic.com',
 'nr-data.net','sentry.io','appsflyer.com','adjust.com','branch.io','kochava.com','scorecardresearch.com',
 'demdex.net','bluekai.com','krxd.net','everesttech.net','adobedtm.com','omtrdc.net','2o7.net','chartbeat.net',
 'parsely.com','permutive.com','lotame.com','adsymptotic.com','onetrust.com','tealiumiq.com'
]);
export const ALL_HOSTS = Object.freeze([...new Set([...AD_HOSTS,...TRACKER_HOSTS])]);
export function isBlockedHost(hostname, mode='all'){
 if(!hostname || mode==='off')return false;
 let host=String(hostname).toLowerCase().replace(/\.$/,'');
 const list = mode==='ads'?AD_HOSTS:ALL_HOSTS;
 return list.some(domain=>host===domain || host.endsWith('.'+domain));
}
export function shouldBlockRequest(url, mainUrl='', mode='all', resourceType='other', allowSites=[]){
 if(mode==='off'||['mainFrame','main_frame','document'].includes(resourceType))return false;
 try{
  const target=new URL(url);if(!['http:','https:'].includes(target.protocol))return false;
  const origin=mainUrl?new URL(mainUrl):null;
  if(origin && allowSites.includes(origin.hostname.toLowerCase()))return false;
  // Do not block a site's own script calls to its own domain.
  if(origin && (origin.hostname===target.hostname || origin.hostname.endsWith('.'+target.hostname)))return false;
  return isBlockedHost(target.hostname,mode);
 }catch{return false}
}
export function cleanLink(input){const url=new URL(input);if(!['https:','http:'].includes(url.protocol))throw new Error('Only web links can be shared');url.username='';url.password='';return url.toString()}
