;(()=>{
/** Pure OS detection. No fingerprinting service or outgoing requests. */
function detectDevice({userAgent='', platform='', uaPlatform='', maxTouchPoints=0}={}) {
  const ua=String(userAgent).toLowerCase();
  const os=String(uaPlatform||platform).toLowerCase();
  const ipadLike=/mac/.test(os)&&Number(maxTouchPoints)>1;
  if (/android/.test(os)||/android/.test(ua)) return {family:'android',os:'Android',confidence:'high'};
  if (/iphone|ipad|ipod/.test(ua)||/iphone|ipad|ios/.test(os)||ipadLike) return {family:'ios',os:ipadLike||/ipad/.test(ua)?'iPadOS':'iOS',confidence:'high'};
  if (/windows/.test(os)||/windows nt/.test(ua)) return {family:'desktop',os:'Windows',confidence:'high'};
  if (/mac/.test(os)||/macintosh/.test(ua)) return {family:'desktop',os:'macOS',confidence:'high'};
  if (/linux/.test(os)||/linux/.test(ua)||/x11/.test(ua)) return {family:'desktop',os:'Linux',confidence:'medium'};
  return {family:'unknown',os:'Unknown',confidence:'none'};
}
function classifyDevice(navigatorLike={}) {
  return detectDevice({userAgent:navigatorLike.userAgent,platform:navigatorLike.platform,uaPlatform:navigatorLike.userAgentData?.platform,maxTouchPoints:navigatorLike.maxTouchPoints});
}
function preferredLabel(device) {
  if(device.family==='desktop') return `Get Pynault for ${device.os}`;
  if(device.family==='android') return 'Get Pynault for Android';
  if(device.family==='ios') return 'Get Pynault for iOS';
  return 'Choose your download';
}

window.PynaultDetection={detectDevice,classifyDevice,preferredLabel};

})();
