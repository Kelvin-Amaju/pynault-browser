import Foundation
import Capacitor
import WebKit
import UIKit

/** Real WKWebViews for untrusted pages. Remote content never has access to the Capacitor bridge. */
@objc(NativePagesPlugin)
public class NativePagesPlugin: CAPPlugin, CAPBridgedPlugin, WKNavigationDelegate {
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
        CAPPluginMethod(name: "downloads", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "window", returnType: CAPPluginReturnPromise)
    ]
    private var tabs: [String: WKWebView] = [:]
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
        let view=WKWebView(frame:pageRect,configuration:config)
        view.navigationDelegate=self
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
    @objc public func shield(_ call: CAPPluginCall){call.resolve() /* URL blocking requires a native content-rule-list implementation */}
    @objc public func downloads(_ call: CAPPluginCall){call.reject("Native downloads are not implemented on iOS in this version")}
    @objc public func window(_ call: CAPPluginCall){call.resolve()}

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
