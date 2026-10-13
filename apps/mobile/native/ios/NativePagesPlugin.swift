import Foundation
import Capacitor
import WebKit
import UIKit
import UniformTypeIdentifiers

/** Real WKWebViews for untrusted pages. Remote content never has access to the Capacitor bridge. */
@objc(NativePagesPlugin)
public class NativePagesPlugin: CAPPlugin, CAPBridgedPlugin, WKNavigationDelegate, WKDownloadDelegate, WKUIDelegate {
    public let identifier = "NativePagesPlugin"
    public let jsName = "NativePages"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "create", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "navigate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "activate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "close", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "action", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "viewport", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shield", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "location", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "downloads", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "window", returnType: CAPPluginReturnPromise)
    ]
    private var tabs: [String: WKWebView] = [:]
    private var activeDownloads: [ObjectIdentifier:String] = [:]
    private var shielding = true
    private var locationBlocked = true
    private var contentRules: WKContentRuleList?
    // WKWebView's content rules block known advertising and tracking resource domains.
    private func compileBlocker(){
        let names = ["doubleclick.net","googleadservices.com","googlesyndication.com","adservice.google.com","pagead2.googlesyndication.com","partner.googleadservices.com","ads-twitter.com","adsrvr.org","adnxs.com","criteo.com","criteo.net","outbrain.com","taboola.com","rubiconproject.com","pubmatic.com","openx.net","indexww.com","bidswitch.net","casalemedia.com","smartadserver.com","lijit.com","yieldmo.com","sharethrough.com","triplelift.com","sovrn.com","advertising.com","amazon-adsystem.com","media.net","revcontent.com","adform.net","adsafeprotected.com","moatads.com","spotxchange.com","teads.tv","gumgum.com","richaudience.com","districtm.io","33across.com","undertone.com","contextweb.com","exelator.com","adroll.com","quantserve.com","zedo.com","bidr.io","rtbhouse.com","adzerk.net","tribalfusion.com","adskeeper.co.uk","popads.net","propellerads.com","propeller-tracking.com","adsterra.com","trafficjunky.net","mgid.com","servedbyopenx.com","aniview.com","adthrive.com","mediavine.com","adpushup.com","nitropay.com","adlightning.com","google-analytics.com","googletagmanager.com","analytics.google.com","facebook.net","connect.facebook.net","pixel.facebook.com","hotjar.com","static.hotjar.com","bat.bing.com","clarity.ms","segment.io","segment.com","mixpanel.com","amplitude.com","fullstory.com","mouseflow.com","inspectlet.com","crazyegg.com","heap.io","heapanalytics.com","matomo.cloud","newrelic.com","nr-data.net","sentry.io","appsflyer.com","adjust.com","branch.io","kochava.com","scorecardresearch.com","demdex.net","bluekai.com","krxd.net","everesttech.net","adobedtm.com","omtrdc.net","2o7.net","chartbeat.net","parsely.com","permutive.com","lotame.com","adsymptotic.com","onetrust.com","tealiumiq.com"]
        var conditions = names.map { ["trigger": ["url-filter": "^https?://([^/]*\\.)?" + NSRegularExpression.escapedPattern(for: $0) + "(/|$)", "resource-type":["script","image","style-sheet","raw","svg-document","font","media","popup"]], "action":["type":"block"]] as [String:Any] }
        conditions.append(["trigger":["url-filter":".*"], "action":["type":"css-display-none","selector":".adsbygoogle, [data-ad-slot], [data-ad-client], .ad-banner, .advertisement"]])
        guard let encoded=try? JSONSerialization.data(withJSONObject:conditions), let json=String(data:encoded,encoding:.utf8) else{return}
        WKContentRuleListStore.default().compileContentRuleList(forIdentifier:"pynault-firstparty-shield",encodedContentRuleList:json){ [weak self] rules,error in
            DispatchQueue.main.async { self?.contentRules=rules;self?.applyBlocker() }
        }
    }
    private func applyBlocker(){for v in tabs.values {v.configuration.userContentController.removeAllContentRuleLists(); if shielding, let r=contentRules{v.configuration.userContentController.add(r)}}}
    private func geoScript() -> WKUserScript {
        let js="""
        (() => {const denied=()=>Promise.reject(new DOMException('Location is blocked by Pynault','NotAllowedError'));
        try {Object.defineProperty(navigator,'geolocation',{configurable:true,get(){return {getCurrentPosition(success,error){error?.({code:1,message:'Location blocked by Pynault'})},watchPosition(success,error){error?.({code:1,message:'Location blocked by Pynault'});return 0},clearWatch(){}}}})}catch(e){}
        })();
        """
        return WKUserScript(source:js,injectionTime:.atDocumentStart,forMainFrameOnly:false)
    }
    private func applyGeoScripts(){for view in tabs.values {view.configuration.userContentController.removeAllUserScripts();if locationBlocked{view.configuration.userContentController.addUserScript(geoScript())}}}
    override public func load() { super.load(); compileBlocker() }

    private var active: String?
    private var visible: Bool = false
    private var pageRect = CGRect(x: 0, y: 60, width: 350, height: 600)
    private var pageIds: [ObjectIdentifier: String] = [:]
    private var privateTabs: [String: Bool] = [:]

    private func valid(_ raw: String?) -> URL? {
        guard let raw=raw, let url=URL(string:raw), let scheme=url.scheme?.lowercased(), ["http","https"].contains(scheme), url.host != nil else {return nil}
        return url
    }
    private func emit(_ view: WKWebView, loading: Bool) {
        guard let id=pageIds[ObjectIdentifier(view)] else{return}
        notifyListeners("pageUpdate", data:["type":"tab-update","id":id,"url":view.url?.absoluteString ?? "","title":view.title ?? "Website","loading":loading,"canGoBack":view.canGoBack,"canGoForward":view.canGoForward])
    }
    private func syncViews() {
        for (id,view) in tabs {
            let show = visible && id == active
            view.isHidden = !show
            if show {view.frame = pageRect; view.superview?.bringSubviewToFront(view)}
        }
    }
    private func ensureTab(_ id: String, privateMode: Bool) -> WKWebView? {
        if let existing=tabs[id]{return existing}
        guard let host=bridge?.viewController?.view else{return nil}
        let config=WKWebViewConfiguration()
        config.websiteDataStore=privateMode ? .nonPersistent() : .default()
        config.preferences.javaScriptCanOpenWindowsAutomatically=false
        if shielding, let r=contentRules {config.userContentController.add(r)}
        if locationBlocked {config.userContentController.addUserScript(geoScript())}
        let view=WKWebView(frame:pageRect,configuration:config)
        view.navigationDelegate=self
        view.uiDelegate=self
        view.allowsBackForwardNavigationGestures=true
        view.isOpaque=true
        view.backgroundColor=UIColor(red:0.05,green:0.09,blue:0.08,alpha:1)
        view.isHidden=true
        host.addSubview(view)
        tabs[id]=view
        pageIds[ObjectIdentifier(view)]=id
        return view
    }
    @objc public func create(_ call: CAPPluginCall){
        DispatchQueue.main.async {
            guard let id=call.getString("id") else{call.reject("Missing id");return}
            let raw=call.getString("url") ?? "pynault://newtab"
            self.privateTabs[id] = call.getBool("privateMode") ?? false
            if let url=self.valid(raw){
                guard let view=self.ensureTab(id,privateMode:self.privateTabs[id] ?? false) else{call.reject("No host view");return}
                view.load(URLRequest(url:url))
            }
            call.resolve()
        }
    }
    @objc public func navigate(_ call: CAPPluginCall){
        DispatchQueue.main.async {
            guard let id=call.getString("id"), let url=self.valid(call.getString("url")) else{call.reject("Invalid address");return}
            guard let view=self.ensureTab(id,privateMode:self.privateTabs[id] ?? false) else{call.reject("No host view");return}
            view.load(URLRequest(url:url));self.syncViews();call.resolve()
        }
    }
    @objc public func activate(_ call: CAPPluginCall){
        DispatchQueue.main.async { self.active=call.getString("id");self.syncViews();call.resolve() }
    }
    @objc public func close(_ call: CAPPluginCall){
        DispatchQueue.main.async {
            if let id=call.getString("id"){self.privateTabs.removeValue(forKey:id);if let view=self.tabs.removeValue(forKey:id){self.pageIds.removeValue(forKey:ObjectIdentifier(view));view.stopLoading();view.removeFromSuperview()}}
            if self.active == call.getString("id") {self.active=nil}
            self.syncViews();call.resolve()
        }
    }
    @objc public func action(_ call: CAPPluginCall){
        DispatchQueue.main.async {
            if let id=call.getString("id"),let view=self.tabs[id]{
                switch call.getString("action") ?? "" {
                case "back": if view.canGoBack {view.goBack()}
                case "forward": if view.canGoForward{view.goForward()}
                case "reload":view.reload()
                case "stop":view.stopLoading()
                case "reader":
                    view.evaluateJavaScript("(function(){let s=document.querySelector('#__pynault_reader');if(s)s.remove();else{s=document.createElement('style');s.id='__pynault_reader';s.textContent='body{max-width:860px!important;margin:20px auto!important;padding:20px!important;line-height:1.85!important;font-size:19px!important}header,footer,aside,nav{display:none!important}';document.documentElement.appendChild(s)}})()",completionHandler:nil)
                default:break
                }
            }
            call.resolve()
        }
    }
    @objc public func viewport(_ call: CAPPluginCall){
        DispatchQueue.main.async {
            if let rect=call.getObject("rect") {
                let x=rect["x"] as? Double ?? 0,y=rect["y"] as? Double ?? 60
                let w=rect["width"] as? Double ?? 350,h=rect["height"] as? Double ?? 600
                self.pageRect=CGRect(x:x,y:y,width:max(1,w),height:max(1,h))
            }
            self.visible=call.getBool("visible") ?? false
            self.syncViews();call.resolve()
        }
    }
    @objc public func shield(_ call: CAPPluginCall){DispatchQueue.main.async {self.shielding=call.getBool("enabled") ?? true;self.applyBlocker();call.resolve()}}
    @objc public func location(_ call: CAPPluginCall){DispatchQueue.main.async {self.locationBlocked=call.getBool("blocked") ?? true;self.applyGeoScripts();self.tabs.values.forEach{$0.reload()};call.resolve()}}
    @objc public func downloads(_ call: CAPPluginCall){
        DispatchQueue.main.async {
            guard let dir=FileManager.default.urls(for:.documentDirectory,in:.userDomainMask).first else {call.reject("Documents folder unavailable");return}
            let controller=UIDocumentPickerViewController(forOpeningContentTypes:[.folder],asCopy:false)
            // Downloads are saved to Pynault/Documents/Downloads and shown in the Files app when UIFileSharingEnabled is true.
            controller.modalPresentationStyle = .formSheet
            if let parent=self.bridge?.viewController {parent.present(controller, animated:true);call.resolve(["path":dir.appendingPathComponent("Downloads").path])}else{call.reject("No active window")}
        }
    }
    public func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void){
        let isAttachment=(navigationResponse.response as? HTTPURLResponse)?.allHeaderFields["Content-Disposition"].map{String(describing:$0).lowercased().contains("attachment")} ?? false
        if !navigationResponse.canShowMIMEType || isAttachment {decisionHandler(.download)} else{decisionHandler(.allow)}
    }
    @available(iOS 14.5, *) public func webView(_ webView: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) {download.delegate=self}
    @available(iOS 14.5, *) public func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {download.delegate=self}
    @available(iOS 14.5, *) public func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void){
        guard let root=FileManager.default.urls(for:.documentDirectory,in:.userDomainMask).first else{completionHandler(nil);return}
        let folder=root.appendingPathComponent("Downloads",isDirectory:true)
        try? FileManager.default.createDirectory(at:folder,withIntermediateDirectories:true)
        let filename=(suggestedFilename as NSString).lastPathComponent
        let suffix=URL(fileURLWithPath:filename).pathExtension
        let stem=URL(fileURLWithPath:filename).deletingPathExtension().lastPathComponent
        var dest=folder.appendingPathComponent(filename);var i=1
        while FileManager.default.fileExists(atPath:dest.path){dest=folder.appendingPathComponent(stem+"-"+String(i)+(suffix.isEmpty ? "" : "."+suffix));i+=1}
        activeDownloads[ObjectIdentifier(download)]=filename
        completionHandler(dest)
    }
    @available(iOS 14.5, *) public func downloadDidFinish(_ download: WKDownload){
        let name=activeDownloads.removeValue(forKey:ObjectIdentifier(download)) ?? "File"
        notifyListeners("pageUpdate",data:["type":"download","id":UUID().uuidString,"name":name,"status":"completed"])
    }
    @available(iOS 14.5, *) public func download(_ download: WKDownload, didFailWithError error: Error, resumeData: Data?){
        let name=activeDownloads.removeValue(forKey:ObjectIdentifier(download)) ?? "File"
        notifyListeners("pageUpdate",data:["type":"download","id":UUID().uuidString,"name":name,"status":"failed"])
    }
    @objc public func window(_ call: CAPPluginCall){call.resolve()}

    @available(iOS 15.0, *) public func webView(_ webView: WKWebView, requestMediaCapturePermissionFor origin: WKSecurityOrigin, initiatedByFrame frame: WKFrameInfo, type: WKMediaCaptureType, decisionHandler: @escaping (WKPermissionDecision) -> Void){
        // WKWebView presents its own site permission UI (plus iOS OS permissions).
        decisionHandler(.prompt)
    }
    public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!){emit(webView,loading:true)}
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!){emit(webView,loading:false)}
    private func emitError(_ view: WKWebView, error: Error){
        guard let id=pageIds[ObjectIdentifier(view)] else{return}
        notifyListeners("pageUpdate", data:["type":"tab-update","id":id,"loading":false,"error":error.localizedDescription])
    }
    public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error){emitError(webView,error:error)}
    public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error){emitError(webView,error:error)}
    public func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void){
        // Common embedded frames use about:, blob: and data: URLs; they do not receive the app's Capacitor bridge.
        if navigationAction.targetFrame?.isMainFrame == false { decisionHandler(.allow); return }
        if navigationAction.targetFrame == nil {
            if let url=valid(navigationAction.request.url?.absoluteString){webView.load(URLRequest(url:url))}
            decisionHandler(.cancel)
            return
        }
        decisionHandler(valid(navigationAction.request.url?.absoluteString) != nil ? .allow : .cancel)
    }
}
