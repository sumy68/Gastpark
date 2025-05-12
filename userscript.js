async function j(e, n) {
    if (typeof e != "string" || !e.length)
        return Promise.reject(new Error("setValue invalid key arg"));
    const t = this.US_filename;
    if (typeof t != "string" || !t.length)
        return Promise.reject(new Error("setValue invalid call"));
    const r = {};
    return r[`${t}---${e}`] = n, browser.storage.local.set(r)
}
async function S(e, n) {
    if (typeof e != "string" || !e.length)
        return Promise.reject(new Error("getValue invalid key arg"));
    const t = this.US_filename;
    if (typeof t != "string" || !t.length)
        return Promise.reject(new Error("getValue invalid call"));
    const r = `${t}---${e}`,
        o = await browser.storage.local.get(r);
    if (r in o)
        return o[r];
    if (n !== void 0)
        return n
}
async function E(e) {
    if (typeof e != "string" || !e.length)
        return Promise.reject(new Error("deleteValue missing key arg"));
    const n = this.US_filename;
    if (typeof n != "string" || !n.length)
        return Promise.reject(new Error("deleteValue invalid call"));
    const t = `${n}---${e}`;
    return browser.storage.local.remove(t)
}
async function v() {
    const e = this.US_filename;
    if (typeof e != "string" || !e.length)
        return Promise.reject(new Error("listValues invalid call"));
    const n = `${e}---`,
        t = await browser.storage.local.get(),
        r = [];
    for (const o in t)
        o.startsWith(n) && r.push(o.slice(n.length));
    return r
}
async function u(e) {
    try {
        const n = await browser.runtime.sendMessage(e);
        return n.status === "fulfilled" ? n.result : Promise.reject(n.result)
    } catch (n) {
        return console.error(n), Promise.reject(n)
    }
}
async function $(e, n=!1) {
    try {
        new URL(e)
    } catch (t) {
        return Promise.reject(t)
    }
    return u({
        name: "API_OPEN_TAB",
        url: e,
        active: !n
    })
}
async function _(e) {
    return u({
        name: "API_CLOSE_TAB",
        tabId: e
    })
}
async function P() {
    return u({
        name: "API_GET_TAB"
    })
}
async function A(e) {
    return e == null ? Promise.reject(new Error("saveTab invalid arg")) : u({
        name: "API_SAVE_TAB",
        tabObj: e
    })
}
async function I(e) {
    return typeof e != "string" || !e.length ? Promise.reject(new Error("addStyle invalid css arg")) : u({
        name: "API_ADD_STYLE",
        css: e
    })
}
async function M(e, n) {
    return u({
        name: "API_SET_CLIPBOARD",
        clipboardData: e,
        type: n
    })
}
function w(e) {
    if (e == null)
        return console.error("xhr invalid details arg");
    if (!e.url)
        return console.error("xhr details missing url key");
    const n = Math.random().toString(36).substring(1, 9),
        t = JSON.parse(JSON.stringify(e)),
        r = [];
    for (const i in XMLHttpRequest.prototype)
        i.slice(0, 2) === "on" && r.push(i);
    for (const i of r)
        typeof e[i] == "function" && (t[i] = !0);
    const o = {
            abort: () => console.error("xhr has not yet been initialized")
        },
        a = i => {
            i.name === n && (i.onMessage.addListener(async c => {
                if (r.includes(c.name) && typeof e[c.name] == "function") {
                    const s = c.response;
                    if (s.readyState === 4 && s.response !== null) {
                        if (s.responseType === "arraybuffer")
                            try {
                                const m = new Uint8Array(s.response).buffer;
                                s.response = m
                            } catch (m) {
                                console.error("error parsing xhr arraybuffer", m)
                            }
                        else if (s.responseType === "blob" && s.response.data) {
                            const b = await (await fetch(s.response.data)).blob();
                            s.response = b
                        }
                    }
                    e[c.name](c.response)
                }
                c.name === "onloadend" && i.postMessage({
                    name: "DISCONNECT"
                })
            }), i.onDisconnect.addListener(c => {
                c != null && c.error && console.error(`port disconnected due to an error: ${c.error.message}`),
                browser.runtime.onConnect.removeListener(a)
            }), o.abort = () => i.postMessage({
                name: "ABORT"
            }))
        };
    return browser.runtime.onConnect.addListener(a), u({
        name: "API_XHR",
        details: t,
        xhrPortName: n,
        events: r
    }), o
}
const p = {
    setValue: j,
    getValue: S,
    listValues: v,
    deleteValue: E,
    openInTab: $,
    getTab: P,
    saveTab: A,
    closeTab: _,
    addStyle: I,
    setClipboard: M,
    xmlHttpRequest: w,
    GM_xmlhttpRequest: w
};
let l,
    g = !1;
const h = T(),
    O = window.self === window.top ? "" : `(${h})`;
function T() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        n = Math.random();
    return e[Math.floor(n * e.length)] + n.toString().slice(5, 6)
}
function y(e) {
    const n = e.scriptObject["run-at"];
    n === "document-start" ? d(e) : n === "document-end" ? document.readyState !== "loading" ? d(e) : document.addEventListener("DOMContentLoaded", () => {
        d(e)
    }) : n === "document-idle" && (document.readyState === "complete" ? d(e) : document.addEventListener("readystatechange", () => {
        document.readyState === "complete" && d(e)
    }))
}
function d(e) {
    const n = e.scriptObject.filename,
        t = e.scriptObject.name,
        r = `${e.code} //# sourceURL=${n.replace(/\s/g, "-") + O}`;
    let o = e.scriptObject["inject-into"];
    o === "auto" && (e.fallback || g) && (o = "content", console.warn(`Attempting fallback injection for ${t}`));
    const a = o === "content" ? "content" : "page";
    if (window.self === window.top ? console.info(`Injecting: ${t} %c(js/${a})`, "color: #fff600") : console.info(`Injecting: ${t} %c(js/${a})%c - %cframe(${h})(${window.location})`, "color: #fff600", "color: inherit", "color: #006fff"), a === "page") {
        const f = document.createElement("div");
        f.style.display = "none";
        const i = f.attachShadow({
                mode: "closed"
            }),
            c = document.createElement("script");
        c.textContent = r,
        i.append(c),
        (document.body ?? document.head ?? document.documentElement).append(f)
    } else
        try {
            return Function(`{${Object.keys(e.apis).join(",")}}`, r)(e.apis)
        } catch (f) {
            console.error(`"${n}" error:`, f)
        }
}
function L(e, n) {
    window.self === window.top ? console.info(`Injecting ${e} %c(css)`, "color: #60f36c") : console.info(`Injecting ${e} %c(css)%c - %cframe(${h})(${window.location})`, "color: #60f36c", "color: inherit", "color: #006fff");
    const t = document.createElement("style");
    t.textContent = n,
    document.head.appendChild(t)
}
function V(e) {
    if (e.effectiveDirective === "script-src" || e.effectiveDirective === "script-src-elem") {
        if (!l || g)
            return;
        g = !0;
        for (let n = 0; n < l.files.js.length; n++) {
            const t = l.files.js[n];
            t.scriptObject["inject-into"] === "auto" && (t.fallback = 1, y(t))
        }
    }
}
async function C() {
    const e = await browser.runtime.sendMessage({
        name: "REQ_USERSCRIPTS"
    });
    if (!e || e.error) {
        console.error((e == null ? void 0 : e.error) || "REQ_USERSCRIPTS returned undefined");
        return
    }
    l = e;
    const n = [...l.files.js, ...l.files.menu];
    for (let t = 0; t < n.length; t++) {
        const r = n[t],
            o = r.scriptObject.filename,
            a = r.scriptObject.grant,
            f = r.scriptObject["inject-into"];
        r.apis = {
            GM: {}
        },
        r.apis.GM.info = {
            script: r.scriptObject,
            scriptHandler: l.scriptHandler,
            scriptHandlerVersion: l.scriptHandlerVersion,
            scriptMetaStr: r.scriptMetaStr
        },
        r.apis.GM_info = r.apis.GM.info,
        a.includes("none") && (a.length = 0),
        a.length && f === "page" && (a.length = 0, console.warn(`${o} @grant values removed due to @inject-into value: ${f} - https://github.com/quoid/userscripts/issues/265#issuecomment-1213462394`)),
        a.length && f === "auto" && (r.scriptObject["inject-into"] = "content", console.warn(`${o} @inject-into value set to 'content' due to @grant values: ${a} - https://github.com/quoid/userscripts/issues/265#issuecomment-1213462394`));
        for (let i = 0; i < a.length; i++) {
            const c = a[i],
                s = c.split(".")[1] || c.split(".")[0];
            if (Object.keys(p).includes(s))
                switch (s) {
                case "info":
                case "GM_info":
                    continue;
                case "getValue":
                case "setValue":
                case "deleteValue":
                case "listValues":
                    r.apis.GM[s] = p[s].bind({
                        US_filename: o
                    });
                    break;
                case "GM_xmlhttpRequest":
                    r.apis[s] = p[s];
                    break;
                default:
                    r.apis.GM[s] = p[s]
                }
        }
        y(r)
    }
    for (let t = 0; t < l.files.css.length; t++) {
        const r = l.files.css[t];
        L(r.name, r.code)
    }
}
function R() {
    browser.runtime.onMessage.addListener(e => {
        if (e.name === "CONTEXT_RUN") {
            if (window !== window.top)
                return;
            const t = e.menuItemId;
            for (let r = 0; r < l.files.menu.length; r++) {
                const o = l.files.menu[r];
                if (o.scriptObject.filename === t) {
                    console.info(`Injecting ${t} %c(js)`, "color: #fff600"),
                    d(o);
                    return
                }
            }
            console.error(`Couldn't find ${t} code!`)
        }
    }),
    document.addEventListener("securitypolicyviolation", V)
}
async function U() {
    const e = await browser.storage.local.get("US_GLOBAL_ACTIVE");
    if ((e == null ? void 0 : e.US_GLOBAL_ACTIVE) === !1)
        return console.info("Userscripts off");
    C(),
    R()
}
U();
