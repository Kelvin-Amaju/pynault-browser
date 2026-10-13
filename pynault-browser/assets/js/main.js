const {classifyDevice,preferredLabel}=window.PynaultDetection;
const {resolveDownload}=window.PynaultDownloads;

const doc=document;
const $=(selector)=>doc.querySelector(selector);
const $$=(selector)=>Array.from(doc.querySelectorAll(selector));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const device=classifyDevice(navigator);
let activeModal=null;

function setText(selector,value){const el=$(selector);if(el)el.textContent=value;}
function loadComplete(){const loader=$('#preloader');loader?.classList.add('loaded');window.setTimeout(()=>loader?.remove(),950);}
if(doc.readyState==='complete') loadComplete(); else window.addEventListener('load',()=>window.setTimeout(loadComplete,390),{once:true});
window.setTimeout(loadComplete,2800); // recover from blocked third-party requests

function updateDeviceUI(){
  const platformCopy={desktop:'Desktop',android:'Android',ios:'iOS'};
  if(device.family==='unknown'){
    setText('#detectedTitle','Choose the device that works for you');
    setText('#detectedHint','We couldn’t reliably identify your device. All three options are available below.');
    setText('#detectPill','MANUAL SELECTION');
    setText('#heroDownloadLabel','Choose your download');
    return;
  }
  setText('#detectedTitle',`Looks like you’re on ${device.os}`);
  setText('#detectedHint',`We’ve highlighted ${platformCopy[device.family]}. You can still choose another platform anytime.`);
  setText('#heroDownloadLabel',preferredLabel(device));
  const recommended=doc.querySelector(`.download-tile[data-platform="${device.family}"]`);
  recommended?.classList.add('recommended');
  if(device.family==='desktop')setText('#desktopTag',`${device.os} · other desktop platforms`);
  recommended?.setAttribute('aria-label',`${platformCopy[device.family]} — recommended for this device`);
}
updateDeviceUI();

function downloadFor(family) {
  const os=family==='desktop'?(device.family==='desktop'?device.os:'Unknown'):family==='ios'?'iOS':'Android';
  const url=resolveDownload(family,os);
  if(url){
    // No guessed URLs and no synthetic success messages. Only published release URLs work.
    window.location.assign(url);return;
  }
  const phrase=family==='desktop'&&os==='Unknown'?'Desktop (Windows, macOS or Linux)':family==='desktop'?os:family==='ios'?'iOS':'Android';
  setText('#downloadModalLabel',`${phrase} release not published yet.`);
  setText('#downloadModalText',`There is no verified ${phrase} installer configured for this page yet. You can download the developer source and build from the README, or return when a release is published.`);
  showReleaseModal();
}
function showReleaseModal(){
  const modal=$('#downloadModal');
  if(!modal)return;
  if(window.bootstrap?.Modal){activeModal=window.bootstrap.Modal.getOrCreateInstance(modal);activeModal.show();return;}
  // Graceful offline fallback if Bootstrap JS CDN is unavailable
  modal.style.display='block';modal.classList.add('show');modal.setAttribute('aria-modal','true');modal.removeAttribute('aria-hidden');
  const backdrop=doc.createElement('div');backdrop.className='modal-backdrop fade show';backdrop.id='offlineBackdrop';doc.body.append(backdrop);
  doc.body.classList.add('modal-open');
}
function closeOfflineModal(){const modal=$('#downloadModal');if(!modal)return;modal.style.display='';modal.classList.remove('show');modal.setAttribute('aria-hidden','true');modal.removeAttribute('aria-modal');$('#offlineBackdrop')?.remove();doc.body.classList.remove('modal-open')}
$$('[data-download]').forEach(btn=>btn.addEventListener('click',()=>downloadFor(btn.dataset.download)));
$('#downloadModal')?.addEventListener('click',(event)=>{if(!window.bootstrap?.Modal&&(event.target.closest('[data-bs-dismiss="modal"]')||event.target.id==='downloadModal'))closeOfflineModal()});
doc.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!window.bootstrap?.Modal)closeOfflineModal()});

const menuToggle=$('#menuToggle');const menu=$('#navLinks');
menuToggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.querySelector('i').className=open?'bi bi-x-lg':'bi bi-list';doc.body.classList.toggle('menu-open',open)});
$$('.nav-links a').forEach(link=>link.addEventListener('click',()=>{menu?.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');if(menuToggle?.querySelector('i'))menuToggle.querySelector('i').className='bi bi-list';doc.body.classList.remove('menu-open')}));

const cleanBtn=$('#cleanBtn'),clutterBtn=$('#clutterBtn'),demoPage=$('.demo-page');
function setPreview(mode){const cluttered=mode==='clutter';demoPage?.classList.toggle('is-cluttered',cluttered);cleanBtn?.classList.toggle('active',!cluttered);clutterBtn?.classList.toggle('active',cluttered);cleanBtn?.setAttribute('aria-pressed',String(!cluttered));clutterBtn?.setAttribute('aria-pressed',String(cluttered))}
cleanBtn?.addEventListener('click',()=>setPreview('clean'));
clutterBtn?.addEventListener('click',()=>setPreview('clutter'));
setPreview('clean');

let scrollQueued=false;
function scrollHandler(){if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{const y=window.scrollY;$('#siteHeader')?.classList.toggle('is-scrolled',y>40);const max=doc.documentElement.scrollHeight-window.innerHeight;const percent=max>0?Math.min(100,Math.max(0,100*y/max)):0;if($('#scrollProgress'))$('#scrollProgress').style.width=`${percent}%`;scrollQueued=false})}
window.addEventListener('scroll',scrollHandler,{passive:true});scrollHandler();
setText('#year',String(new Date().getFullYear()));

function initReveal(){
 const reveals=$$('[data-reveal]');
 if(reducedMotion){reveals.forEach(el=>el.style.opacity='1');return;}
 if(window.gsap&&window.ScrollTrigger){window.gsap.registerPlugin(window.ScrollTrigger);reveals.forEach((el)=>{window.gsap.fromTo(el,{opacity:0,y:32},{opacity:1,y:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 96%',once:true}})});return;}
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('will-reveal');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px 25px 0px'});reveals.forEach(el=>{el.classList.add('will-reveal');observer.observe(el)});return;}
}
// Deferred so CDN animations have time to initialize; the site works even with all CDNs blocked.
window.addEventListener('load',initReveal,{once:true});
if(doc.readyState==='complete')initReveal();

if(!reducedMotion&&window.matchMedia('(min-width: 992px)').matches){
 const heroBrowser=$('#heroBrowser');
 heroBrowser?.addEventListener('pointermove',e=>{const bounds=heroBrowser.getBoundingClientRect();const x=(e.clientX-bounds.left)/bounds.width-.5;const y=(e.clientY-bounds.top)/bounds.height-.5;const inner=heroBrowser.querySelector('.browser-window');if(inner)inner.style.transform=`perspective(1500px) rotateY(${x*2.5}deg) rotateX(${2-y*1.8}deg)`});
 heroBrowser?.addEventListener('pointerleave',()=>{const inner=heroBrowser.querySelector('.browser-window');if(inner)inner.style.transform='perspective(1500px) rotateX(2deg)'});
}
