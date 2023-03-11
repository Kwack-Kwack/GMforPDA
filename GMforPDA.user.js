// ==UserScript==
// @name         GMforPDA
// @namespace    https://github.com/Kwack-Kwack/GMforPDA
// @version      0.1
// @description  A userscript that allows GM_ functions to be called in tornPDA. Simply replace the underscore (_) with a period (.) eg GM.addStyle
// @author       Kwack [2190604]
// @match        https://*
// ==/UserScript==

/* NOTES:
    - setClipboard will only work whilst document is focused
    - xmlhttpRequest only supports url, method, onload and onerror arguments. Onload is called via promise chaining, and onerror via promise catching.
    - response#responseText is how you access the response from GM.xmlHttpRequest (same as with PDA_httpGet)
    - getValue / setValue is global and NOT script-specific. Use a unique storage key to prevent potential clashes with other scripts.
*/

window.GM = {
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
        s.innerHTML = style;

        document.head.appendChild(s);
    },

    setClipboard(text) {
        navigator.clipboard.writeText(text);
    },

    async xmlhttpRequest(details) {
        if (!details.method || details.method.toLowerCase() === "get") {
            return await PDA_httpGet(details.url)
                .then(details.onload)
                .catch(details.onerror ?? ((e) => console.error(e)));
        } else if (details.method.toLowerCase() === "post") {
            return await PDA_httpPost(
                details.url,
                details.headers ?? {},
                details.body ?? ""
            )
                .then(details.onload)
                .catch(details.onerror ?? ((e) => console.error(e)));
        } else throw new Error("Invalid method passed to GM.xmlHttpRequest");
    },
};
