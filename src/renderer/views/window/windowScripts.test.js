import * as windowScripts from './windowScripts';

describe('function getWindowHeight:', () => {
	it('expect return value to be equal to pre-calculated value:', () => {
		const a = 10;
		const b = 15;
		const c = 100;
		const pre = c - a - b;
		expect(windowScripts.getWindowHeight(c, `${a}px`, `${b}px`)).toBe(pre);
	});
});
