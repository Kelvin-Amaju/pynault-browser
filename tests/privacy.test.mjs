import {test} from 'node:test';import assert from 'node:assert/strict';
import {isBlockedHost,shouldBlockRequest,cleanLink} from '../src/privacy/rules.js';
test('ad domains and subdomains blocked',()=>{assert.equal(isBlockedHost('x.doubleclick.net'),true);assert.equal(isBlockedHost('fake-doubleclick.net'),false)});
test('tracker setting off and ads only',()=>{assert.equal(isBlockedHost('hotjar.com','ads'),false);assert.equal(isBlockedHost('hotjar.com','all'),true);assert.equal(isBlockedHost('doubleclick.net','ads'),true)});
test('main-frame URLs stay navigable',()=>assert.equal(shouldBlockRequest('https://doubleclick.net/','https://example.com','all','mainFrame'),false));
test('first-party and exception website stay enabled',()=>{assert.equal(shouldBlockRequest('https://pixel.facebook.com/a','https://facebook.com','all','script',['facebook.com']),false)});
test('blocks third party requests',()=>assert.equal(shouldBlockRequest('https://ads.doubleclick.net/a','https://news.example','all','script'),true));
test('rejects javascript sharing URLs',()=>assert.throws(()=>cleanLink('javascript:alert(1)')));
test('removes credentials',()=>assert.equal(cleanLink('https://u:p@example.com/a'),'https://example.com/a'));
