// ==UserScript==
// @name         GMforPDA
// @namespace    https://github.com/Kwack-Kwack/GMforPDA
// @version      2.0
// @description  A userscript that allows GM_ functions to be called in tornPDA. Simply replace the underscore (_) with a period (.) eg GM.addStyle
// @author       Kwack [2190604]
// @match        https://*
// ==/UserScript==

(async () => {
	/** In PDA, scripts are not sandboxed so there is no need for unsafeWindow. */
	window.unsafeWindow = window;

	ver = 2.0;

	window.GM_info = {
		script: {},
		scriptHandler: `GMforPDA version ${ver}`,
	};

	console.log(GM_info);

	function __GM_getValue(key, defaultValue) {
		if (!key) throw new TypeError("No key supplied to GM_getValue");
		const r = localStorage.getItem(key);
		if (!r) return defaultValue ?? null;
		try {
			const j = JSON.parse(r);
			if (j) return j;
			else return defaultValue ?? null;
		} catch (e) {
			if (e instanceof SyntaxError)
				return r; // Return original string if could not parse JSON, for legacy reasons
			else {
				console.error(
					"**Error with GM_getValue - please contact Kwack [2190604]**",
					e
				);
				throw e;
			}
		}
	}
	window.GM_getValue = __GM_getValue;

	function __GM_setValue(key, value) {
		if (!key) throw new TypeError("No key supplied to GM_setValue");
		localStorage.setItem(key, JSON.stringify(value));
	}
	window.GM_setValue = __GM_setValue;

	function __GM_deleteValue(key) {
		if (!key) throw new TypeError("No key supplied to GM_deleteValue");
		localStorage.removeItem(key);
	}
	window.GM_deleteValue = __GM_deleteValue;

	function __GM_listValues() {
		return Object.keys(localStorage);
	}
	window.GM_listValues = __GM_listValues;

	function __GM_addStyle(style) {
		if (!style || typeof style !== "string") return;
		const s = document.createElement("style");
		s.type = "text/css";
		s.innerHTML = style;
		document.head.appendChild(s);
	}
	window.GM_addStyle = __GM_addStyle;

	function __GM_notification(...args) {
		if (typeof args[0] === "object") {
			const { text, title, onclick, ondone } = args[0];
			notify(text, title, onclick, ondone);
		} else if (typeof args[0] === "string") {
			const [text, title, , onclick] = args;
			notify(text, title, onclick);
		}

		return { remove: () => {} }; // There to prevent syntax errors.

		function notify(text, title, onclick, ondone) {
			if (!text)
				throw new TypeError(
					"No notification text supplied to GM_notification"
				);
			confirm(`${title ?? "No title specified"}\n${text}`) && onclick?.();
			ondone();
		}
	}
	window.GM_notification = __GM_notification;

	function __GM_setClipboard(text) {
		if (!text) throw new TypeError("No text supplied to GM_setClipboard");
		navigator.clipboard.writeText(text);
	}
	window.GM_setClipboard = __GM_setClipboard;

	function __GM_xmlhttpRequest(details) {
		const { abortController } = ___coreXmlHttpRequest(details);
		if (!details || typeof details !== "object")
			throw new TypeError("Invalid details passed to GM_xmlHttpRequest");
		return { abort: () => abortController.abort() };
	}
	window.GM_xmlhttpRequest = __GM_xmlhttpRequest;

	const GM = {
		info: __GM_info,
		addStyle: __GM_addStyle,
		deleteValue: async (key) => __GM_deleteValue(key),
		getValue: async (key, defaultValue) => __GM_getValue(key, defaultValue),
		listValues: async () => __GM_listValues(),
		notification: __GM_notification,
		setClipboard: __GM_setClipboard,
		setValue: async (key, value) => __GM_setValue(key, value),
		xmlHttpRequest: async (details) => {
			if (!details || typeof details !== "object")
				throw new TypeError(
					"Invalid details passed to GM.xmlHttpRequest"
				);
			const { abortController, prom } = ___coreXmlHttpRequest(details);
			prom.abort = () => abortController.abort();
			return prom;
		},
	};
	window.GM = GM;

	/** 3 underscores on this one, as it's an internal function */
	function ___coreXmlHttpRequest(details) {
		const abortController = new AbortController();
		const abortSignal = abortController.signal;
		const timeoutController = new AbortController();
		const timeoutSignal = timeoutController.signal;
		const {
			url,
			method,
			headers,
			timeout,
			data,
			onabort,
			onerror,
			onload,
			onloadend,
			onprogress,
			onreadystatechange,
			ontimeout,
		} = details;
		setTimeout(() => timeoutController.abort(), timeout ?? 30000);

		const prom = new Promise(async (res, rej) => {
			abortSignal.addEventListener("abort", () => rej("Request aborted"));
			timeoutSignal.addEventListener("abort", () =>
				rej("Request timed out")
			);
			if (!method || method.toLowerCase() !== "post") {
				PDA_httpGet(url).then(res).catch(rej);
				onprogress?.();
			} else {
				PDA_httpPost(url, headers ?? {}, data ?? "")
					.then(res)
					.catch(rej);
				onprogress?.();
			}
		})
			.then((r) => {
				onload?.(r);
				onloadend?.(r);
				onreadystatechange?.(r);
			})
			.catch((e) => {
				switch (true) {
					case e === "Request aborted":
						onabort?.(e);
						break;
					case e === "Request timed out":
						ontimeout?.(e);
						break;
					default:
						onerror?.(e);
				}
			});

		return { abortController, prom };
	}
})();
