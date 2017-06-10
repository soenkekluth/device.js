device.js
=========

client and server side device / useragent detection for easier adaptive development / design

inspired & partly copied from https://github.com/matthewhudson/device.js but much more performand and flexible.

supports React server side rendering.



# Usage

### Browser

```javascript
import { device } from 'device.js';

// add specific classes like "mobile" "ios" "android" "desktop" to the html element.
device.addClasses(document.documentElement);

// check at runtime
if (device.mobile){
  // do mobile stuff
} else if (device.tablet || device.desktop) {
  // do tablet && desktop stuff
}

```

### Node

```javascript
// 1
import { device } from 'device.js';

device.setUserAgent(ua);

////////////////////////

// 2
import Device from 'device.js';

const device = new Device(ua1);
const device2 = new Device(ua2);

```

### Getters

```
deviceorientation
ie9
ie10
touch
ios
iphone
ipod
ipad
android
androidPhone
androidTablet
blackberry
blackberryPhone
blackberryTablet
windows
windowsPhone
windowsTablet
fxos
fxosPhone
fxosTablet
meego
cordova
nodeWebkit
mobile
tablet
desktop
television
portrait
landscape
```
