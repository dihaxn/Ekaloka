import { JSDOM } from 'jsdom';
import '@testing-library/jest-dom';

if (typeof window === 'undefined' || !global.window) {
	const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
	global.window = dom.window;
	global.document = dom.window.document;
	global.HTMLElement = dom.window.HTMLElement;
	global.navigator = { userAgent: 'node.js' };
}
