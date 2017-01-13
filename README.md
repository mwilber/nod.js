nod.js
=======================================

A custom event plugin for detecting simple head gestures using mobile web browsers in a google cardboard compatible VR viewer. 
Based on shake.js, created by Alex Gibson.

Installation
---------------------------------------

* Download: [zip](https://github.com/mwilber/nod.js/zipball/master)
* Git: `git clone https://github.com/mwilber/nod.js`

Dependencies
---------------------------------------

Your web browser must support the `devicemotion` event for this plugin to work. Nod.js uses built-in feature detection to determine if it can run in your web browser. It will terminate silently on non-supporting browsers.

http://w3c.github.io/deviceorientation/spec-source-orientation.html

Setup
---------------------------------------

```
<script src="nod.js"></script>
```

Next, create a new Shake instance:

```
var nodEvent = new Nod({
    threshold: 5, // optional shake strength threshold
    timeout: 1000 // optional, determines the frequency of event generation
});
```

Start listening to device motion:

```
nodEvent.start();
```

Register a `nod` event listener on `window` with your callback:

```
window.addEventListener('nod', EventDidOccur, false);

//function to call when shake occurs
function EventDidOccur (e) {

    //put your own code here etc.
    alert('nod: '+e.direction);
}
```

You can stop listening for shake events like so:

```
window.removeEventListener('nod', EventDidOccur, false);
```

To stop listening to device motion, you can call:

```
nodEvent.stop();
```

Supported web browsers/devices
---------------------------------------

- iOS Safari 4.2.1 (and above)
- Android 4.0.3 (default browser)
- Chrome 41+ for Android
- Opera Mobile (Android)
- BlackBerry PlayBook 2.0
- Firefox for Android
- FirefoxOS Devices
