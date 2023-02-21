// ==UserScript==
// @name         GMforPDA
// @namespace    https://github.com/Kwack-Kwack/GMforPDA
// @version      0.1
// @description  A userscript that allows GM_ functions to be called in tornPDA. Simply replace the underscore (_) with a period (.) eg GM.addStyle
// @author       Kwack [2190604]
// @match        *://*/*
// ==/UserScript==

const GM = {
    getValue(key, defaultValue) {
        return localStorage.getItem(key) ?? defaultValue;
    },

    setValue(key, value) {
        localStorage.setItem(key, value);
    },

    deleteValue(key) {
        localStorage.removeItem(key);
    },

    addStyle(style) {
        const s = document.createElement("style");
        s.type = "text/css";
        s.innerHTML = s;

        document.head.appendChild(s);
    },

    setClipboard(text) {
        navigator.clipboard.writeText(text);
    },

    async xmlhttpRequest(details) {
        if (!details.method || details.method.toLowerCase() === "get") {
            return PDA_httpGet(details.url).then(details.onload).catch(details.onerror)
        } else if (details.method.toLowerCase() === "post") {
            return PDA_httpPost(details.url, details.headers, details.body).then(details.onload).catch(details.onerror)
        } else throw new Error("Invalid method passed to GM.xmlHttpRequest")
    }
};

const unsafeWindow = window;
