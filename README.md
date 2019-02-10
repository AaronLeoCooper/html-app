# HTMLApp

Fatigued by JavaScript tools? Unsure if you should be in the React, Vue or
`<insert other library>` camp? Do you just need some JS to enhance your HTML pages?

Create a HTML page, stick this JavaScript somewhere and off you go. Apps done **simply**.

```js
var app = new HTMLApp();
```

## Benefits

- HTML is your view, JavaScript is your controller/model, the way we used to do web development
- Listen to many DOM events and react to them efficiently
- Thin DOM element wrappers to provide just the right amount of helper methods for your app logic
- No build/transpilation setup needed: stick it in a HTML page and off you go! 🚀

## Installation

The library can downloaded and included in your HTML pages:

```html
<script src="vendor/html-app.browser.js"></script>
```

Or installed from NPM and included as an ES6 library import in your JavaScript files:

```bash
npm i html-app
```

```js
import HTMLApp from 'html-app';
```
