import fs from 'fs';
import test from 'ava';
import jsdom from "jsdom";
import { device } from './lib/device';
const { JSDOM } = jsdom;


const uas = {
  ieMobile: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
  android4: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  android23: 'Mozilla/5.0 (Linux; U; Android 2.3; en-us) AppleWebKit/999+ (KHTML, like Gecko) Safari/999.9',
  chromeWin: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  chromeMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
  safariTablet: 'Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5'
}

const html = `<!DOCTYPE html>
<html lang="en">
<body>
</body>
</html>`;

test('check device != undefined', t => {

  // const dom = new JSDOM(html);
  // global.window = dom.window;
  // global.document = dom.window.document;
  // global.Image = dom.window.Image;

  // t.true(player.state.preloading);

  t.true(typeof device !== 'undefined');

});

test('setUserAgent safariTablet', t => {
  device.setUserAgent(uas.safariTablet);
  t.pass();
});

test('is tablet', t => {
  t.true(device.tablet);
});

test('is ipad', t => {
  t.true(device.ipad);
});

test('is ios', t => {
  t.true(device.ios);
});

test('is not android', t => {
  t.false(device.android);
});
test('is not desktop', t => {
  t.false(device.desktop);
});
