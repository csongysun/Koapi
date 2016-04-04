(function(name, definition) {
	if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		module.exports = definition();
	} else if (typeof define === 'function' && typeof define.amd === 'object') {
		define(definition);
	} else {
		this[name] = definition();
	}
})('validator', function(validator) {

	validator = {};

	validator.trim = function(str, chars) {
		var pattern = chars ? new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g') : /^\s+|\s+$/g;
		return str.replace(pattern, '');
	};

	validator.isName = function(a) {
		return /^[0-9a-zA-Z\u4e00-\u9fa5_-]+$/.test(a)
	};
	validator.isEmpty = function(a) {
		return /^\s*$/g.test(a.replace(/^\s+|\s+$/g, ""))
	};
	validator.isNumber = function(a) {
		return /^[+\-]?\d+(\.\d+)?$/.test(a)
	};

	validator.isStuid = function(a) {
		return /^201[0-9]{11}$/.test(a)
	};


	validator.isPwd = function(a) {
		return /^[0-9a-zA-Z\_\.]{6,16}$/.test(a)
	}
	validator.isEmailName = function(a) {
		return /^[0-9a-z_][_.0-9a-z-]{0,31}$/.test(a)
	};
	validator.isMobile = function(a) {
		return /^1[3|4|5|8][0-9]{9}$/.test(a)
	};
	validator.isWeird = function(a) {
		return /[\u3002\uff1b\uff0c\uff1a\uff08\uff09\u3001\uff1f\u300a\u300b\uFF01\u201c\u201d\u2018\u2019\u300e\u300f\u300c\u300d\uFF09\uFF08\.\_\-\?\~\!\@\#\$\%\^\&\*\\\+\`\=\[\]\(\)\{\}\|\;\'\:\"\,\/\<\>]/i.exec(a)
	};

	validator.trim = function(str, chars) {
		var pattern = chars ? new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g') : /^\s+|\s+$/g;
		return str.replace(pattern, '');
	};

	validator.isEmail = function(a) {
		if (!/^[0-9a-z_][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$/.test(a)) return !1;
		if (a && a != "" && a.indexOf("@") != -1) {
			var b = a.indexOf("@"),
				c = a.substring(0, b);
			return c.length > 64 || a.length > 256 ? !1 : !0
		}
		return !1
	};

	return validator;
});