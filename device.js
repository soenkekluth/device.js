(function(exports) {

  'use strict';

  var device = function(userAgent, docElement) {

    var device = {};

    docElement = docElement || window.document.documentElement;
    userAgent = userAgent || window.navigator.userAgent.toLowerCase();


    function find(needle) {
      return userAgent.indexOf(needle) !== -1;
    }

    function hasClass(className) {
      var regex;
      regex = new RegExp(className, 'i');
      return docElement.className.match(regex);
    }

    function addClass(className) {
      if (!hasClass(className)) {
        docElement.className += ' ' + className;
      }
    }

    function removeClass(className) {
      if (hasClass(className)) {
        docElement.className = docElement.className.replace(className, '');
      }
    }

    device.ios = function() {
      return device.iphone() || device.ipod() || device.ipad();
    };

    device.iphone = function() {
      return find('iphone');
    };

    device.ipod = function() {
      return find('ipod');
    };

    device.ipad = function() {
      return find('ipad');
    };

    device.android = function() {
      return find('android');
    };

    device.androidPhone = function() {
      return device.android() && find('mobile');
    };

    device.androidTablet = function() {
      return device.android() && !find('mobile');
    };

    device.blackberry = function() {
      return find('blackberry') || find('bb10') || find('rim');
    };

    device.blackberryPhone = function() {
      return device.blackberry() && !find('tablet');
    };

    device.blackberryTablet = function() {
      return device.blackberry() && find('tablet');
    };

    device.windows = function() {
      return find('windows');
    };

    device.windowsPhone = function() {
      return device.windows() && find('phone');
    };

    device.windowsTablet = function() {
      return device.windows() && (find('touch') && !device.windowsPhone());
    };

    device.fxos = function() {
      return (find('(mobile;') || find('(tablet;')) && find('; rv:');
    };

    device.fxosPhone = function() {
      return device.fxos() && find('mobile');
    };

    device.fxosTablet = function() {
      return device.fxos() && find('tablet');
    };

    device.meego = function() {
      return find('meego');
    };

    device.cordova = function() {
      return window.cordova && location.protocol === 'file:';
    };

    device.nodeWebkit = function() {
      return typeof window.process === 'object';
    };

    device.mobile = function() {
      return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
    };

    device.tablet = function() {
      return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
    };

    device.desktop = function() {
      return !device.tablet() && !device.mobile();
    };

    device.portrait = function() {
      return (window.innerHeight / window.innerWidth) > 1;
    };

    device.landscape = function() {
      return (window.innerHeight / window.innerWidth) < 1;
    };

    device.standAlone = function() {
      return window.navigator.standalone === true;
    };


    device.addClasses = function() {

      if (device._hasAddClasses) {
        return;
      }
      device._hasAddClasses = true;

      if (device.ios()) {
        if (device.ipad()) {
          addClass('ios ipad tablet');
        } else if (device.iphone()) {
          addClass('ios iphone mobile');
        } else if (device.ipod()) {
          addClass('ios ipod mobile');
        }
      } else if (device.android()) {
        if (device.androidTablet()) {
          addClass('android tablet');
        } else {
          addClass('android mobile');
        }
      } else if (device.blackberry()) {
        if (device.blackberryTablet()) {
          addClass('blackberry tablet');
        } else {
          addClass('blackberry mobile');
        }
      } else if (device.windows()) {
        if (device.windowsTablet()) {
          addClass('windows tablet');
        } else if (device.windowsPhone()) {
          addClass('windows mobile');
        } else {
          addClass('desktop');
        }
      } else if (device.fxos()) {
        if (device.fxosTablet()) {
          addClass('fxos tablet');
        } else {
          addClass('fxos mobile');
        }
      } else if (device.meego()) {
        addClass('meego mobile');
      } else if (device.nodeWebkit()) {
        addClass('node-webkit');
      } else {
        addClass('desktop');
      }

      if (device.cordova()) {
        addClass('cordova');
      }

      if (device.standAlone()) {
        addClass('standalone');
      }
    };



    device.addOrientationClasses = function() {

      if (device.hasOrientationListener) {
        return;
      }

      device.hasOrientationListener = true;

      var onOrientationChange = function() {
        if (device.landscape()) {
          removeClass('portrait');
          return addClass('landscape');
        } else {
          removeClass('landscape');
          return addClass('portrait');
        }
      };

      var orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';

      if (window.addEventListener) {
        window.addEventListener(orientationEvent, onOrientationChange, false);
      } else if (window.attachEvent) {
        window.attachEvent(orientationEvent, onOrientationChange);
      } else {
        window[orientationEvent] = onOrientationChange;
      }

      onOrientationChange();

    };

    return device;
  };

  (typeof module !== 'undefined' && module.exports) ? (module.exports = device) : (typeof define === 'function' && define.amd ? (define([], function() {
    return device;
  })) : (exports.device = device));

}(this));
