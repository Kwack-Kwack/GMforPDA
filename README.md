# GMforPDA
### How to use
*Please note: this userscript should be run at the document start, not document end; so it will add GM methods before other userscripts execute.*

This userscript (built for [Torn PDA](https://github.com/Manuito83/torn-pda)) should allow you to use basic GreaseMonkey (GM_) functions. It cufrently supports:
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
  // Argument r is the response object, access the response via r.responseText. Please note that if this should be JSON, you must call JSON.parse(r)
  onerror: (e) => console.error(e), //optional, this is the default. Catches the error and passes it to the onerror function.
  headers: { //optional, POST requests only. 
    "Content-Type": "application/json",
  },
  body: JSON.stringify(exampleData) //optional, POST requests only. Only supports strings.
})
```