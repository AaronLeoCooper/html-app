# HTMLApp

Need just a sprinkling of JS to enhance your HTML pages? ✨

Create a HTML page, stick this JavaScript somewhere and off you go. Simple web apps done *simply*.

## Example

Define your view with HTML:

```html
<body>
  <div data-htmlapp>
    <input data-ha="userName" />
    <span data-ha="userNameError"></span>
  </div>
  
  <!-- include your JS files: -->
  <script src="html-app.browser.min.js"></script>
  <script src="app.js"></script>
</body>
```

Define your app logic with JavaScript:

```js
// app.js
new HTMLApp({
  listeners: [
    {
      el: 'userName',
      onChange: function(e, el) {
        if (!e.target.value) {
          this.getEl('userNameError').setText('This field is required!');

          el.setClass('has-error');
        } else {
          this.getEl('userNameError').setText('');

          el.removeClass('has-error');
        }
      }
    }
  ]
});
```

Job done! 🎉

## Features

- HTML is your view, JavaScript is your controller/model (the way we used to do web development!)
- Listen to as many DOM events as necessary and react to them without browser "chug"
- Thin DOM element wrappers provide just the right amount of helper methods for your app logic
- No build/transpilation/configuration setup needed— stick it in a HTML page and off you go! 🚀

## Installation

The compressed library JavaScript file can downloaded and included in your HTML pages:

```html
<script src="vendor/html-app.browser.min.js"></script>
```

Or installed via NPM and included as an ES6 library import in your JavaScript files:

```bash
npm i html-app
```

```js
import HTMLApp from 'html-app';
```
