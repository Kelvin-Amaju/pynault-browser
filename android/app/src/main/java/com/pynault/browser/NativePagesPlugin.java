package com.pynault.browser;

import android.app.DownloadManager;
import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.content.Intent;
import android.os.Build;
import android.os.Environment;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.PermissionRequest;
import android.app.Activity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.webkit.GeolocationPermissions;
import android.app.AlertDialog;
import android.Manifest;
import android.content.pm.PackageManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

/** Native website renderer above the Capacitor chrome. Remote websites have no Capacitor JS bridge. */
@CapacitorPlugin(name = "NativePages")
public class NativePagesPlugin extends Plugin {
    private final Map<String,WebView> tabs = new HashMap<>();
    private String activeId = null;
    private boolean contentVisible = true;
    private boolean shield = true;
    private int x = 0, y = 60, width = 350, height = 600;
    private volatile boolean locationBlocked = true;
    private static PermissionRequest pendingMedia;
    private static GeolocationPermissions.Callback pendingGeo;
    private static String pendingGeoOrigin;
    public static void completeSystemPermission(int code, int[] results){
      boolean allGranted=results.length>0;for(int x:results)allGranted &= x==PackageManager.PERMISSION_GRANTED;
      if(code==8405 && pendingMedia!=null){PermissionRequest request=pendingMedia;pendingMedia=null;if(allGranted)request.grant(request.getResources());else request.deny();}
      if(code==8406 && pendingGeo!=null){GeolocationPermissions.Callback cb=pendingGeo;String origin=pendingGeoOrigin;pendingGeo=null;pendingGeoOrigin=null;cb.invoke(origin,allGranted,false);}
    }
    private static final String[] BLOCK_DOMAINS = {"doubleclick.net","googleadservices.com","googlesyndication.com","adservice.google.com","pagead2.googlesyndication.com","partner.googleadservices.com","ads-twitter.com","adsrvr.org","adnxs.com","criteo.com","criteo.net","outbrain.com","taboola.com","rubiconproject.com","pubmatic.com","openx.net","indexww.com","bidswitch.net","casalemedia.com","smartadserver.com","lijit.com","yieldmo.com","sharethrough.com","triplelift.com","sovrn.com","advertising.com","amazon-adsystem.com","media.net","revcontent.com","adform.net","adsafeprotected.com","moatads.com","spotxchange.com","teads.tv","gumgum.com","richaudience.com","districtm.io","33across.com","undertone.com","contextweb.com","exelator.com","adroll.com","quantserve.com","zedo.com","bidr.io","rtbhouse.com","adzerk.net","tribalfusion.com","adskeeper.co.uk","popads.net","propellerads.com","propeller-tracking.com","adsterra.com","trafficjunky.net","mgid.com","servedbyopenx.com","aniview.com","adthrive.com","mediavine.com","adpushup.com","nitropay.com","adlightning.com","google-analytics.com","googletagmanager.com","analytics.google.com","facebook.net","connect.facebook.net","pixel.facebook.com","hotjar.com","static.hotjar.com","bat.bing.com","clarity.ms","segment.io","segment.com","mixpanel.com","amplitude.com","fullstory.com","mouseflow.com","inspectlet.com","crazyegg.com","heap.io","heapanalytics.com","matomo.cloud","newrelic.com","nr-data.net","sentry.io","appsflyer.com","adjust.com","branch.io","kochava.com","scorecardresearch.com","demdex.net","bluekai.com","krxd.net","everesttech.net","adobedtm.com","omtrdc.net","2o7.net","chartbeat.net","parsely.com","permutive.com","lotame.com","adsymptotic.com","onetrust.com","tealiumiq.com"};

    private boolean safe(String raw) {
        if (raw == null) return false;
        Uri u = Uri.parse(raw);
        return ("https".equalsIgnoreCase(u.getScheme()) || "http".equalsIgnoreCase(u.getScheme())) && u.getHost() != null;
    }
    private void emit(String id, JSObject patch) {
        patch.put("type", "tab-update"); patch.put("id", id);
        notifyListeners("pageUpdate", patch);
    }
    private void state(String id, WebView v, boolean loading) {
        JSObject o = new JSObject();
        o.put("url", v.getUrl()==null?"":v.getUrl());
        o.put("title",v.getTitle()==null?"Website":v.getTitle());
        o.put("loading",loading);o.put("canGoBack",v.canGoBack());o.put("canGoForward",v.canGoForward());
        emit(id,o);
    }
    private FrameLayout root(){return (FrameLayout)getActivity().findViewById(android.R.id.content);}
    private int px(double css){return (int)Math.round(css*getActivity().getResources().getDisplayMetrics().density);}
    private WebView build(final String id) {
        WebView v = new WebView(getActivity());
        v.setBackgroundColor(Color.rgb(9,18,18));
        v.getSettings().setJavaScriptEnabled(true);
        v.getSettings().setDomStorageEnabled(true);
        v.getSettings().setAllowFileAccess(false);
        v.getSettings().setAllowContentAccess(false);
        v.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        v.getSettings().setSupportMultipleWindows(false);
        v.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request){return !safe(request.getUrl().toString());}
            @Override public void onPageStarted(WebView view,String url,android.graphics.Bitmap icon){state(id,view,true);}
            @Override public void onPageFinished(WebView view,String url){
                if(shield)view.evaluateJavascript("(function(){if(document.querySelector('#__pynault_adcss'))return;var s=document.createElement('style');s.id='__pynault_adcss';s.textContent='.adsbygoogle,[data-ad-slot],[data-ad-client],.ad-banner,.advertisement{display:none!important}';document.documentElement.appendChild(s)})()",null);
                state(id,view,false);
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest req,WebResourceError error){
                if(req.isForMainFrame()){
                    JSObject update=new JSObject();
                    update.put("loading",false);
                    update.put("error",error.getDescription().toString());
                    emit(id,update);
                }
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest req){
                if(shield && !req.isForMainFrame() && req.getUrl().getHost()!=null){
                  String host=req.getUrl().getHost().toLowerCase();
                  String current="";try{current=Uri.parse(view.getUrl()).getHost().toLowerCase();}catch(Exception ignored){}
                  if(host.equals(current))return null;
                  for(String t:BLOCK_DOMAINS){if(host.equals(t)||host.endsWith("."+t))return new WebResourceResponse("text/plain","utf-8",new ByteArrayInputStream(new byte[0]));}
                }
                return null;
            }
        });
        v.setWebChromeClient(new WebChromeClient(){
            @Override public void onPermissionRequest(PermissionRequest request){
              getActivity().runOnUiThread(()->{
                String site=request.getOrigin().getHost();
                new AlertDialog.Builder(getActivity()).setTitle("Site media permission")
                  .setMessage(site+" wants access to your camera or microphone. Only approve a trusted website.")
                  .setNegativeButton("Block",(d,w)->request.deny())
                  .setPositiveButton("Allow",(d,w)->{
                    java.util.List<String> ask=new java.util.ArrayList<>();
                    for(String resource:request.getResources()){
                      if(resource.equals(PermissionRequest.RESOURCE_VIDEO_CAPTURE)&&ContextCompat.checkSelfPermission(getActivity(),Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED)ask.add(Manifest.permission.CAMERA);
                      else if(resource.equals(PermissionRequest.RESOURCE_AUDIO_CAPTURE)&&ContextCompat.checkSelfPermission(getActivity(),Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED)ask.add(Manifest.permission.RECORD_AUDIO);
                    }
                    if(!ask.isEmpty()){pendingMedia=request;ActivityCompat.requestPermissions(getActivity(),ask.toArray(new String[0]),8405);}
                    else request.grant(request.getResources());
                  }).show();
              });
            }
            @Override public void onGeolocationPermissionsShowPrompt(String origin,GeolocationPermissions.Callback callback){
                if(locationBlocked){callback.invoke(origin,false,false);return;}
                getActivity().runOnUiThread(()->new AlertDialog.Builder(getActivity())
                  .setTitle("Website location request").setMessage(origin+" wants your approximate location. Grant only if you trust this website.")
                  .setNegativeButton("Block",(d,w)->callback.invoke(origin,false,false))
                  .setPositiveButton("Allow",(d,w)->{
                    boolean granted=androidx.core.content.ContextCompat.checkSelfPermission(getActivity(),Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;
                    if(!granted){pendingGeo=callback;pendingGeoOrigin=origin;ActivityCompat.requestPermissions(getActivity(),new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},8406);}
                    else callback.invoke(origin,true,false);
                  }).show());
            }
            @Override public void onReceivedTitle(WebView view,String title){JSObject o=new JSObject();o.put("title",title);emit(id,o);}
            @Override public void onProgressChanged(WebView view,int progress){if(progress==100)state(id,view,false);}
        });
        v.setDownloadListener((url,userAgent,contentDisposition,mimeType,contentLength)->{
            try{
                DownloadManager.Request request=new DownloadManager.Request(Uri.parse(url));
                request.setTitle(android.webkit.URLUtil.guessFileName(url,contentDisposition,mimeType));
                request.setMimeType(mimeType);
                request.addRequestHeader("User-Agent",userAgent);
                String cookie=CookieManager.getInstance().getCookie(url);
                if(cookie!=null && !cookie.isEmpty())request.addRequestHeader("Cookie",cookie);
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,android.webkit.URLUtil.guessFileName(url,contentDisposition,mimeType));
                ((DownloadManager)getActivity().getSystemService(Context.DOWNLOAD_SERVICE)).enqueue(request);
                JSObject msg=new JSObject();msg.put("type","toast");msg.put("message","Download started");notifyListeners("pageUpdate",msg);
            }catch(Exception ex){JSObject msg=new JSObject();msg.put("type","toast");msg.put("message","Download failed: "+ex.getMessage());notifyListeners("pageUpdate",msg);}
        });
        v.setVisibility(View.GONE);
        root().addView(v,new FrameLayout.LayoutParams(1,1));
        return v;
    }
    private void layout(){
        for(Map.Entry<String,WebView> entry:tabs.entrySet()){
            WebView v=entry.getValue();
            boolean show=contentVisible && entry.getKey().equals(activeId);
            v.setVisibility(show?View.VISIBLE:View.GONE);
            if(show){FrameLayout.LayoutParams p=new FrameLayout.LayoutParams(Math.max(1,width),Math.max(1,height));p.leftMargin=x;p.topMargin=y;v.setLayoutParams(p);v.bringToFront();}
        }
    }
    @PluginMethod public void create(PluginCall call){
        final String id=call.getString("id"), url=call.getString("url","pynault://newtab");
        if(id==null){call.reject("Missing tab ID");return;}
        if(Boolean.TRUE.equals(call.getBoolean("privateMode",false))){call.reject("Private tabs need isolated Android WebView storage and are not enabled in this preview");return;}
        getActivity().runOnUiThread(()->{
            if(!tabs.containsKey(id) && safe(url)){WebView v=build(id);tabs.put(id,v);v.loadUrl(url);}
            call.resolve();
        });
    }
    @PluginMethod public void navigate(PluginCall call){
        String id=call.getString("id"),url=call.getString("url");
        if(!safe(url)){call.reject("Only HTTP(S) URLs are allowed");return;}
        getActivity().runOnUiThread(()->{
            WebView v=tabs.get(id);if(v==null){v=build(id);tabs.put(id,v);}v.loadUrl(url);layout();call.resolve();
        });
    }
    @PluginMethod public void activate(PluginCall call){
        getActivity().runOnUiThread(()->{activeId=call.getString("id");layout();call.resolve();});
    }
    @PluginMethod public void close(PluginCall call){
        getActivity().runOnUiThread(()->{String id=call.getString("id");WebView v=tabs.remove(id);if(v!=null){root().removeView(v);v.destroy();}if(id!=null&&id.equals(activeId))activeId=null;layout();call.resolve();});
    }
    @PluginMethod public void action(PluginCall call){
        getActivity().runOnUiThread(()->{
            WebView v=tabs.get(call.getString("id"));String action=call.getString("action","");
            if(v!=null){switch(action){
                case "back":if(v.canGoBack())v.goBack();break;
                case "forward":if(v.canGoForward())v.goForward();break;
                case "reload":v.reload();break;
                case "stop":v.stopLoading();break;
                case "reader":v.evaluateJavascript("(function(){let s=document.querySelector('#__pynault_reader');if(s)s.remove();else{s=document.createElement('style');s.id='__pynault_reader';s.textContent='body{max-width:860px!important;margin:20px auto!important;padding:20px!important;line-height:1.85!important;font-size:19px!important}header,footer,aside,nav{display:none!important}';document.documentElement.appendChild(s)}})()",null);break;
            }}call.resolve();
        });
    }
    @PluginMethod public void viewport(PluginCall call){
        JSObject r=call.getObject("rect");
        getActivity().runOnUiThread(()->{
            if(r!=null){x=px(r.optDouble("x",0));y=px(r.optDouble("y",60));width=px(r.optDouble("width",350));height=px(r.optDouble("height",600));}
            contentVisible=Boolean.TRUE.equals(call.getBoolean("visible",false));layout();call.resolve();
        });
    }
    @PluginMethod public void shield(PluginCall call){shield=Boolean.TRUE.equals(call.getBoolean("enabled",true));call.resolve();}
    @PluginMethod public void location(PluginCall call){locationBlocked=Boolean.TRUE.equals(call.getBoolean("blocked",true));call.resolve();}
    @PluginMethod public void downloads(PluginCall call){
        getActivity().runOnUiThread(()->{
            try{
                getActivity().startActivity(new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS));
                call.resolve();
            }catch(Exception ex){call.reject("Downloads app unavailable",ex);}
        });
    }
    @PluginMethod public void window(PluginCall call){call.resolve();}
    @Override protected void handleOnDestroy(){for(WebView v:tabs.values()){v.destroy();}tabs.clear();}
}
