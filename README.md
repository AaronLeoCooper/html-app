<p align="center"><a href="https://html-app.com"><img alt="HTMLApp" src="https://www.html-app.com/img/logo.png"></a></p>

# HTMLApp

[![CircleCI](https://circleci.com/gh/AaronLeoCooper/html-app.svg?style=svg&circle-token=80bc42acba0754d42bc16d20afa52df4096c11fb)](https://circleci.com/gh/AaronLeoCooper/html-app)

Need just a sprinkling of JS to enhance your HTML pages? ✨

Create a HTML page, stick this JavaScript somewhere and off you go. Simple web apps done *simply*.

[Check out the docs!](https://html-app.com).

## Example

Define your view with HTML:

```html
<body>
  <!-- define your app view -->
  <div data-htmlapp>
    <input data-ha="userName" />
    <span data-ha="userNameError"></span>
  </div>

  <script src="html-app.browser.min.js"></script>
  <script src="app.js"></script>
</body>
```

Define your app logic with JavaScript:

```js
// app.js
new HTMLApp({
  eventHandlers: [
    {
      id: 'userName',
      onChange: function(e, el, app) {
        if (!e.target.value) {
          app.getEl('userNameError').setText('This field is required!');
  
          el.addClass('has-error');
        } else {
          app.getEl('userNameError').setText('');
  
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
- Easily react to as many events as required with no drop in performance
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
