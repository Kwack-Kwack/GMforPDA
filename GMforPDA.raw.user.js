// @match *

(async () => {
	function t(t, e) {
		if (!t) throw new TypeError("No key supplied to GM_getValue");
		const o = localStorage.getItem(t);
		if (!o) return e ?? null;
		try {
			const t = JSON.parse(o);
			return t || (e ?? null);
		} catch (t) {
			if (t instanceof SyntaxError) return o;
			throw t;
		}
	}
	function e(t, e) {
		if (!t) throw new TypeError("No key supplied to GM_setValue");
		localStorage.setItem(t, JSON.stringify(e));
	}
	function o(t) {
		if (!t) throw new TypeError("No key supplied to GM_deleteValue");
		localStorage.removeItem(t);
	}
	function n() {
		return Object.keys(localStorage);
	}
	function r(t) {
		if (!t || "string" != typeof t) return;
		const e = document.createElement("style");
		(e.type = "text/css"), (e.innerHTML = t), document.head.appendChild(e);
	}
	function i(...t) {
		if ("object" == typeof t[0]) {
			const { text: o, title: n, onclick: r, ondone: i } = t[0];
			e(o, n, r, i);
		} else if ("string" == typeof t[0]) {
			const [o, n, , r] = t;
			e(o, n, r);
		}
		return { remove: () => {} };
		function e(t, e, o, n) {
			if (!t)
				throw new TypeError(
					"No notification text supplied to GM_notification"
				);
			confirm(`${e ?? "No title specified"}\n${t}`) && o?.(), n();
		}
	}
	function a(t) {
		if (!t) throw new TypeError("No text supplied to GM_setClipboard");
		navigator.clipboard.writeText(t);
	}
	(window.unsafeWindow = window),
		(ver = 2),
		(window.GM_info = {
			script: {},
			scriptHandler: `GMforPDA version ${ver}`,
		}),
		(window.GM_getValue = t),
		(window.GM_setValue = e),
		(window.GM_deleteValue = o),
		(window.GM_listValues = n),
		(window.GM_addStyle = r),
		(window.GM_notification = i),
		(window.GM_setClipboard = a),
		(window.GM_xmlhttpRequest = function (t) {
			const { abortController: e } = l(t);
			if (!t || "object" != typeof t)
				throw new TypeError(
					"Invalid details passed to GM_xmlHttpRequest"
				);
			return { abort: () => e.abort() };
		});
	const s = {
		info: __GM_info,
		addStyle: r,
		deleteValue: async (t) => o(t),
		getValue: async (e, o) => t(e, o),
		listValues: async () => n(),
		notification: i,
		setClipboard: a,
		setValue: async (t, o) => e(t, o),
		xmlHttpRequest: async (t) => {
			if (!t || "object" != typeof t)
				throw new TypeError(
					"Invalid details passed to GM.xmlHttpRequest"
				);
			const { abortController: e, prom: o } = l(t);
			return (o.abort = () => e.abort()), o;
		},
	};
	function l(t) {
		const e = new AbortController(),
			o = e.signal,
			n = new AbortController(),
			r = n.signal,
			{
				url: i,
				method: a,
				headers: s,
				timeout: l,
				data: c,
				onabort: d,
				onerror: u,
				onload: w,
				onloadend: p,
				onprogress: f,
				onreadystatechange: y,
				ontimeout: b,
			} = t;
		setTimeout(() => n.abort(), l ?? 3e4);
		return {
			abortController: e,
			prom: new Promise(async (t, e) => {
				o.addEventListener("abort", () => e("Request aborted")),
					r.addEventListener("abort", () => e("Request timed out")),
					a && "post" === a.toLowerCase()
						? (PDA_httpPost(i, s ?? {}, c ?? "")
								.then(t)
								.catch(e),
						  f?.())
						: (PDA_httpGet(i).then(t).catch(e), f?.());
			})
				.then((t) => {
					w?.(t), p?.(t), y?.(t);
				})
				.catch((t) => {
					switch (!0) {
						case "Request aborted" === t:
							d?.(t);
							break;
						case "Request timed out" === t:
							b?.(t);
							break;
						default:
							u?.(t);
					}
				}),
		};
	}
	window.GM = s;
})();
