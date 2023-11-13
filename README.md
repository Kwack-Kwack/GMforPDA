# GMforPDA

### How to use

Install this script into [Torn PDA](https://github.com/Manuito83/torn-pda/) and select a `start` injection time, to make sure it injects before any other scripts. This script will add the GM\_ functions to the window object, so you can use them as you would normally.

This script is still in an alpha stage and has not been tested as extensively as I would have hoped. Please submit any issues/requests via the [github issues](https://github.com/Kwack-Kwack/GMforPDA/issues) or [submit a pull request](https://github.com/Kwack-Kwack/GMforPDA/pulls).

Please note this script adds a `GM` object to the window with these methods. This means that calling the function with an underscore (eg `GM_addStyle`) will still throw an undefined error. You must use either the period syntax (eg `GM.addStyle`) or define the required functions at the top of the script (eg `const GM_addStyle = GM.addStyle;`).

Many scripts will not "magically" work with this script due to requiring other reworks that come with mobile browsers. Please reach out to me if you have any questions, or if any scripts are not working as expected.

### API Documentation

##### `ver`

The version of the script. This is a string in the format `major.minor` (e.g. `1.0`). **THIS IS THE _GMforPDA_ VERSION, NOT THE SCRIPT VERSION.**
To ensure the script version is the same major version, use `Math.floor(GM.ver) === desiredMajorVersion`.

##### `getValue(key, defaultValue)` / `setValue(key, value)` / `deleteValue(key)` / `listValues()`

All the above use the browser's `localStorage`. Please note that:

-   These are not isolated on a script basis, and other scripts will have access to the same data. Use unique keys to avoid conflicts.
-   This is not permanent storage and may be erased over time or by another script. It is also purged whenever the user clears their cache in PDA.

##### `addStyle(style)`

Same syntax as the GM\_ function. Adds a stylesheet to the document's head. `style` argument should be a string.

##### `setClipboard(text)`

Requires the document to be focused - the function will exit silently if not. Use an empty string to clear the clipboard. Please note that iOS will sometimes prompt the user whether to allow PDA to access the clipboard due to security concerns.

##### `xmlhttpRequest(details)`

The details object only accepts the following keys:

-   `url` - The URL to send the request to. Required.
-   `onload` - A function to execute after the request is complete. The response object is passed as the first argument. Required.
-   `onerror?` - A function to execute if the request fails. The error object is passed as the first argument. Defaults to `(e) => console.error(e)`
-   `method?` - The HTTP method to use. Defaults to `GET`. Throws an error if the method is neither `GET` nor `POST`.
-   `headers?` - An object containing the headers to send. Defaults to an empty object.
-   `data?` - The data to send. Defaults to an empty string. Only supports strings (stringify all JSON data). Works with either a `data` or `body` key. Only works with `POST` requests.

##### `notification(...args)`

Uses the native javascript `confirm()` rather than a native notification due to platform restrictions. Syntax is either `notification(text, title, null, onclick)` or `notification(arg)` where `arg` is an object with the following keys:

-   `text` - The text to display in the notification. Required.
-   `title?` - The title of the notification.
-   `onclick?` - A function that executes when the user clicks "yes" on the prompt
-   `ondone?` - A function that executes after the prompt is dismissed, regardless of which button was pressed.

Many other GM functions are not supported due to inability to rewrite in vanilla JS.
