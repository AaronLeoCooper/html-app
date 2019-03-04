<p align="center"><a href="https://html-app.com"><img alt="HTMLApp" src="https://www.html-app.com/img/logo.png"></a></p>

# HTMLApp

[![npm](https://img.shields.io/npm/v/html-app.svg?style=flat-square)](https://www.npmjs.com/package/html-app)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/html-app.svg?style=flat-square)](https://bundlephobia.com/result?p=html-app)
[![David](https://img.shields.io/david/AaronLeoCooper/html-app.svg?style=flat-square)](https://david-dm.org/aaronleocooper/html-app)
[![CircleCI branch](https://img.shields.io/circleci/project/github/AaronLeoCooper/html-app/master.svg?style=flat-square)](https://circleci.com/gh/AaronLeoCooper/html-app/tree/master)
[![NPM](https://img.shields.io/npm/l/html-app.svg?style=flat-square)](https://www.npmjs.com/package/html-app)

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
- Dependency-free and super small: [less than 2kb gzipped](https://bundlephobia.com/result?p=html-app)
- No build/transpilation/configuration setup needed— stick it in a HTML page and off you go! 🚀

## Installation

The compressed library JavaScript file can downloaded and included in your HTML pages, or
linked to directly via the Unpkg CDN:

```html
<script src="https://unpkg.com/html-app/dist/html-app.browser.min.js"></script>
```

Or alternatively if you're compiling your JS files with a bundler like Parcel or Webpack, it
can be installed via NPM and included as an ES6 import in your JavaScript files:

```bash
npm i html-app
```

```js
import HTMLApp from 'html-app';
```
