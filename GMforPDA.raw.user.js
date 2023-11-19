const ver = 0.2;

if (!window.flutter_inappwebview)
	throw new Error(
		"GMforPDA requires flutter_inappwebview to be defined. Ensure this script is running inside of PDA."
	);

window.GM = {
	ver,

	getValue(key, defaultValue) {
		return localStorage.getItem(key) ?? defaultValue;
	},

	setValue(key, value) {
		localStorage.setItem(key, value);
	},

	deleteValue(key) {
		localStorage.removeItem(key);
	},

	listValues() {
		return Object.values(localStorage);
	},

	addStyle(style) {
		if (!style) return;
		const s = document.createElement("style");
		s.type = "text/css";
		s.innerHTML = style;

		document.head.appendChild(s);
	},

	setClipboard(text) {
		if (!document.hasFocus())
			throw new DOMException("Document is not focused");
		navigator.clipboard.writeText(text);
	},

	async xmlhttpRequest(details) {
		try {
			if (!details || typeof details !== "object")
				throw new TypeError(
					"Invalid details passed to GM.xmlHttpRequest"
				);
			const { url, method, data, body, headers, onload, onerror } =
				details;
			if (!url || !(typeof url == "string" || url instanceof URL))
				throw new TypeError("Invalid url passed to GM.xmlHttpRequest");
			if (method && typeof method !== string)
				throw new TypeError(
					"Invalid method passed to GM.xmlHttpRequest"
				);
			if (!method || method.toLowerCase() === "get") {
				return await PDA_httpGet(url)
					.then(onload ?? ((x) => x))
					.catch(onerror ?? ((e) => console.error(e)));
			} else if (method.toLowerCase() === "post") {
				const h = headers ?? {};
				h["X-GMforPDA"] = "Sent from PDA via GMforPDA";
				url = url instanceof URL ? url.href : url;
				return await PDA_httpPost(url, h ?? {}, body ?? data ?? "")
					.then(onload ?? ((x) => x))
					.catch(onerror ?? ((e) => console.error(e)));
			} else
				throw new TypeError(
					"Invalid method passed to GM.xmlHttpRequest"
				);
		} catch (e) {
			console.error(
				"An uncaught error occured in GM.xmlHttpRequest - please report this in the PDA discord if this is unexpected. The error is above ^ "
			);
			console.error(e instanceof Error ? e : JSON.stringify(e));
			throw e instanceof Error ? e : new Error(e);
		}
	},

	notification(...args) {
		let text, title, onclick, ondone;
		if (typeof args[0] === "string") {
			[text, title, , onclick] = args;
		} else {
			({ text, title, onclick, ondone } = args[0]);
		}
		const alert =
			(title
				? `Notification from script ${title}:`
				: "Notification from unnamed source:") +
			"\n" +
			text;
		if (confirm(alert)) onclick?.();
		return ondone?.();
	},

	openInTab(url) {
		if (!url) throw TypeError("No URL provided to GM.openInTab");
		window.open(url, "_blank");
	},

	info: {
		script: {
			description: "This information is unavailable in TornPDA",
			excludes: [],
			includes: [],
			matches: [],
			name: undefined,
			namespace: undefined,
			resources: {},
			"run-at": undefined,
			version: undefined,
		},
		scriptMetaStr: "This information is unavailable in TornPDA",
		scriptHandler: `TornPDA, using GMforPDA version ${ver}`,
		version: ver,
	},
};

Object.entries(GM).forEach(([k, v]) => (window[`GM_${k}`] = v));
