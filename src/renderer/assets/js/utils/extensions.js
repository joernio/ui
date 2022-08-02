export const mouseTrapGlobalBindig = mousetrap => {
	(function (a) {
		const c = {};
		const d = a.prototype.stopCallback;
		a.prototype.stopCallback = function (e, b, a, f) {
			return this.paused ? !0 : c[a] || c[f] ? !1 : d.call(this, e, b, a);
		};
		a.prototype.bindGlobal = function (a, b, d) {
			this.bind(a, b, d);
			if (a instanceof Array)
				for (b = 0; b < a.length; b += 1) c[a[b]] = !0;
			else c[a] = !0;
		};
		a.init();
	})(mousetrap);
};
