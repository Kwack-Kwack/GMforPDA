# GMforPDA
### How to use
*Please note: this userscript should be run at the document start, not document end; so it will add GM methods before other userscripts execute.*

This userscript (built for [Torn PDA](https://github.com/Manuito83/torn-pda)) should allow you to use basic GreaseMonkey (GM_) functions. 

You can use it with the functions below by replacing the underscore in the GM function with a period (e.g. `GM_addStyle` to `GM.addStyle`). This is done intentionally to force users to be aware that modification of source code **will** be required for this to work, and I do not guarantee that this will work with all GreaseMonkey userscripts. You'll also require modification for the other greasemonkey headers in the `//==Userscript==` header, as PDA only acts on the match pattern.

Please note that mobile browsers, especially on iOS, behave differently than chromium browsers so your userscripts will not act the same as they may on PC. 


It currently supports:
#### `getValue(key, defaultValue)` / `setValue(key, value)` / `deleteValue(key)`
Uses the browser's localStorage, please note that this is not permanent storage and may be erased over time / manually by the user.
#### `addStyle(style)`
Adds a stylesheet to the document's head. `style` argument should be a string.
#### `setClipboard(text)`
Copies supplied string to the clipboard. Use an empty string to clear the clipboard.
#### `xmlhttpRequest(details)`
Opens a http request.
##### The details object must contain at least the url. Examples are below.
```js
await GM.xmlhttpRequest({
  url: "https://api.example.com/",
  method: "POST", //optional, defaults to GET
  onload: (r) => console.log(r.responseText), //optional, executes this function after the request is complete.
  // Argument r is the response object, access the response via r.responseText. Please note that if this should be JSON, you must call JSON.parse(r.responseText)
  onerror: (e) => console.error(e), //optional, this is the default. Catches the error and passes it to the onerror function.
  headers: { //optional, POST requests only. 
    "Content-Type": "application/json",
  },
  body: JSON.stringify(exampleData) //optional, POST requests only. Only supports strings.
})
```
Submit any issues/requests via the [github issues](https://github.com/Kwack-Kwack/GMforPDA/issues) or [submit a pull request](https://github.com/Kwack-Kwack/GMforPDA/pulls).