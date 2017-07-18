import { addClass, removeClass, hasClass } from 'dom-helpers/class';
import throttle from 'lodash/throttle';

let documentTimeout = null;

const documentCallbacks = [];
const stopDocumentTimeout = () => {
  if (documentTimeout) {
    clearTimeout(documentTimeout);
    documentTimeout = null;
  }
};

const waitForDocument = callback => {
  if (callback) {
    documentCallbacks.push(callback);
  }
  if (typeof document !== 'undefined') {
    stopDocumentTimeout();
    for (let i = 0, l = documentCallbacks.length; i < l; i++) {
      documentCallbacks[i](document);
    }
    documentCallbacks.length = 0;
    return;
  }
  stopDocumentTimeout();
  setTimeout(() => {
    waitForDocument();
  }, 100);
};

const getUserAgent = () => {
  if (typeof document !== 'undefined') {
    return window.navigator.userAgent;
  }
  return '';
};


const isIE = (v) => {
  return RegExp('msie' + (!isNaN(v)?('\\s'+v):''), 'i').test(navigator.userAgent);
};

// const getDocumentElement = () => {
//   if (typeof document !== 'undefined') {
//     return document.documentElement;
//   }
//   return null;
// };

// Check if documentElement already has a given class.
// const hasClass = (domNode, className) => {
//   let regex;
//   regex = new RegExp(className, 'i');
//   return domNode.className.match(regex);
// };

// // Add one or more CSS classes to the <html> element.
// const addClass = (domNode, className) => {
//   let currentClassNames = null;
//   if (!hasClass(domNode, className)) {
//     currentClassNames = domNode.className.replace(/^\s+|\s+$/g, '');
//     domNode.className = currentClassNames + ' ' + className;
//   }
// };

// // Remove single CSS class from the <html> element.
// const removeClass = (domNode, className) => {
//   if (hasClass(domNode, className)) {
//     domNode.className = domNode.className.replace(' ' + className, '');
//   }
// };

let staticDevice = null;

class Device {
  static get device() {
    if (!staticDevice) {
      staticDevice = new Device();
    }
    return staticDevice;
  }

  constructor(userAgent = null) {
    this.state = {
      addedClasses: false
    };

    this.matchCache = {};
    this.featureCache = {};
    this.classes = '';

    this.setUserAgent(userAgent);

    this.callback = null;

    if (typeof document === 'undefined' && !this.userAgent) {
      // console.log('document net defined');
      waitForDocument(() => {
        this.setUserAgent();
      });
    }
  }

  match(needle) {
    if (!this.matchCache[needle]) {
      this.matchCache[needle] = this.userAgent.indexOf(needle) > -1;
    }
    return this.matchCache[needle];
  }

  feature(key) {

    return this.featureCache[key];
  }

  addFeature(key, value) {
    if (!this.featureCache[key]) {
      this.featureCache[key] = value;
    }
    return value;
  }

  setUserAgent(userAgent = null) {
    this.userAgent = userAgent || this.userAgent || getUserAgent();

    if (this.userAgent) {
      stopDocumentTimeout();
      this.matchCache = {};
      this.userAgent = this.userAgent.toLowerCase();
    }
  }

  onOrientationChange(orientation) {
    // console.log('orientation', orientation);
  }

  getClasses() {
    if (this.classes) {
      return this.classes;
    }

    if (!this.userAgent) {
      this.setUserAgent();
    }

    if (this.landscape) {
      this.classes += 'landscape ';
    } else {
      this.classes += 'portrait ';
    }

    if (this.touch) {
      this.classes += 'touch ';
    }
    if (this.ios) {
      if (this.ipad) {
        this.classes += 'ios ipad tablet ';
      } else if (this.iphone) {
        this.classes += 'ios iphone mobile ';
      } else if (this.ipod) {
        this.classes += 'ios ipod mobile ';
      }
    } else if (this.android) {
      if (this.androidTablet) {
        this.classes += 'android tablet ';
      } else {
        this.classes += 'android mobile ';
      }
    } else if (this.blackberry) {
      if (this.blackberryTablet) {
        this.classes += 'blackberry tablet ';
      } else {
        this.classes += 'blackberry mobile ';
      }
    } else if (this.windows) {
      if (this.windowsTablet) {
        this.classes += 'windows tablet ';
      } else if (this.windowsPhone) {
        this.classes += 'windows mobile ';
      } else {
        this.classes += 'windows desktop ';
      }
    } else if (this.fxos) {
      if (this.fxosTablet) {
        this.classes += 'fxos tablet ';
      } else {
        this.classes += 'fxos mobile ';
      }
    } else if (this.meego) {
      this.classes += 'meego mobile ';
    } else if (this.nodeWebkit) {
      this.classes += 'node-webkit ';
    } else if (this.television) {
      this.classes += 'television ';
    } else if (this.desktop) {
      this.classes += 'desktop ';
    }

    if (this.cordova) {
      this.classes += 'cordova ';
    }

    if (!this.desktop && this.deviceorientation) {
      this.classes += 'deviceorientation ';
    }
    this.classes = this.classes.slice(0, -1);
    return this.classes;
  }

  addClasses(targetNode) {
    if (!this.targetNode) {
      this.targetNode = targetNode;
      if (!targetNode && typeof document !== 'undefined') {
        this.targetNode = document.documentElement;
      }

      if (!this.targetNode) {
        // console.warn('addClasses to nothing?');
        return;
      }

      if (!this.userAgent) {
        this.setUserAgent();
      }

      this.commitClasses();

      this.addListener();
    }
  }

  addListener() {

    if (this.hasListener) {
      return;
    }

    this.hasListener = true;
    this.handleOrientation = this.handleOrientation.bind(this);
    this.onResize = throttle(this.handleOrientation, 200);

    const onOrientationChange = () => {
      setTimeout(() => {
        this.handleOrientation();
      }, 10);
    };

    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', onOrientationChange, false);
    } else {
      window.addEventListener('resize', this.onResize, false);
    }
    onOrientationChange();
  }

  handleOrientation() {
    this.onOrientationChange(this.landscape);
    if (!this.targetNode){
      return;
    }
    if (this.landscape) {
      removeClass(this.targetNode, 'portrait');
      addClass(this.targetNode, 'landscape');
    } else {
      removeClass(this.targetNode, 'landscape');
      addClass(this.targetNode, 'portrait');
    }
  }

  commitClasses() {
    if (this.state.addedClasses || !this.targetNode) {
      return;
    }
    this.state.addedClasses = true;
    this.targetNode.className += this.getClasses();
  }

  get features() {

    return {
      wheelEvent: this.feature('wheelEvent') || this.addFeature('wheelEvent', ('onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
          document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
          'DOMMouseScroll')) // let's assume that remaining browsers are older Firefox
    };
    // detect available wheel event
    // support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
    //   document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
    //   'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

  }

  get deviceorientation() {
    if (!this.canOrientate) {
      this.canOrientate =
        'ondeviceorientation' in window || 'deviceorientation' in window;
    }
    return !this.desktop && this.canOrientate;
  }

  get ie9(){
    if (!this.matchCache['ie9']) {
      if (typeof document !== 'undefined') {
        this.matchCache['ie9'] = this.windows && isIE(10);
      }
    }
    return this.matchCache['ie9'] || false;
  }

  get touchDevice() {
    if (!this.matchCache['touchDevice']) {
      if (typeof document !== 'undefined') {
        this.matchCache['touchDevice'] = !!(navigator && navigator.userAgent) && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
      }
    }
    return this.matchCache['touchDevice'] || false;
  }


  get touch() {
    if (!this.matchCache['touch']) {
      if (typeof document !== 'undefined') {
        this.matchCache['touch'] = (('ontouchstart' in window) ||( window.DocumentTouch && document instanceof DocumentTouch) || (navigator && navigator.msMaxTouchPoints > 0) || (navigator && navigator.maxTouchPoints));
      }
    }
    return this.matchCache['touch'] || false;

  }

  get ios() {
    return this.iphone || this.ipod || this.ipad;
  }

  get iphone() {
    return !this.windows && this.match('iphone');
  }

  get ipod() {
    return this.match('ipod');
  }

  get ipad() {
    return this.match('ipad');
  }

  get android() {
    return !this.windows && this.match('android');
  }

  get androidPhone() {
    return this.android && this.match('mobile');
  }

  get androidTablet() {
    return this.android && !this.match('mobile');
  }

  get blackberry() {
    return this.match('blackberry') || this.match('bb10') || this.match('rim');
  }

  get blackberryPhone() {
    return this.blackberry && !this.match('tablet');
  }

  get blackberryTablet() {
    return this.blackberry && this.match('tablet');
  }

  get windows() {
    return this.match('windows');
  }

  get ie10(){
    if (!this.matchCache['ie10']) {
      if (typeof document !== 'undefined') {
        this.matchCache['ie10'] = this.windows && isIE(10);
      }
    }
    return this.matchCache['ie10'] || false;
  }

  get windowsPhone() {
    return this.windows && this.match('phone');
  }

  get windowsTablet() {
    return this.windows && (this.match('touch') && !this.windowsPhone);
  }

  get fxos() {
    return (
      (this.match('(mobile;') || this.match('(tablet;')) && this.match('; rv:')
    );
  }

  get fxosPhone() {
    return this.fxos && this.match('mobile');
  }

  get fxosTablet() {
    return this.fxos && this.match('tablet');
  }

  get meego() {
    return this.match('meego');
  }

  get cordova() {
    return window.cordova && location.protocol === 'file:';
  }

  get nodeWebkit() {
    return typeof window.process === 'object';
  }

  get mobile() {
    return (
      this.androidPhone ||
      this.iphone ||
      this.ipod ||
      this.windowsPhone ||
      this.blackberryPhone ||
      this.fxosPhone ||
      this.meego
    );
  }

  get tablet() {
    return (
      this.ipad ||
      this.androidTablet ||
      this.blackberryTablet ||
      this.windowsTablet ||
      this.fxosTablet
    );
  }

  get desktop() {
    return !this.tablet && !this.mobile;
  }

  get television() {
    let i,
      television = [
        'googletv',
        'viera',
        'smarttv',
        'internet.tv',
        'netcast',
        'nettv',
        'appletv',
        'boxee',
        'kylo',
        'roku',
        'dlnadoc',
        'roku',
        'pov_tv',
        'hbbtv',
        'ce-html'
      ];

    i = 0;
    while (i++ < television.length) {
      if (this.match(television[i])) {
        return true;
      }
    }
    return false;
  }

  get portrait() {
    if ('orientation' in window) {
      return window.orientation === 0;
    }
    if (typeof window !== 'undefined') {
      return window.innerHeight / window.innerWidth > 1;
    }
    return false;
  }

  get landscape() {
    if (typeof window !== 'undefined') {
      if ('orientation' in window) {
        return window.orientation !== 0;
      }
      return window.innerHeight / window.innerWidth < 1;
    }
    return false;
  }
}
export const device = new Device();
export default Device;
