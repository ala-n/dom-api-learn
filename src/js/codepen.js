(function () {
	function forEachElement(parray, callback) {
		parray && Array.prototype.forEach.call(parray, callback);
	}

	function openCodepen(title, htmlCode, cssCode, jsCode) {
		var form = document.querySelector('form[action="https://codepen.io/pen/define"]');
		if (form) {
			form.querySelector('input[name=data]').setAttribute('value', JSON.stringify({
				title: title,
				html: htmlCode,
				css: cssCode,
				js: jsCode
			}));
			form.submit();
		}
	}

	function openCodepenNS(id) {
		var template = document.querySelector('template#' + id);

		if (!template) { return; }
        var cloneContent = document.importNode(template.content, true);

		var jsEls = cloneContent.querySelectorAll('script.codepen-js');
        var cssEls = cloneContent.querySelectorAll('style.codepen-css');

        var js = '', css = '', html = '';

        forEachElement(jsEls, function (script) {
			js += script.innerHTML + '\n';
			cloneContent.removeChild(script);
        });
        forEachElement(cssEls, function (style) {
            css += style.innerHTML + '\n';
            cloneContent.removeChild(style);
        });
        var contentWrap = document.createElement('div');
        contentWrap.appendChild(cloneContent.cloneNode(true));
        html += contentWrap.innerHTML;

		openCodepen('Example', html, css, js);
	}

	// Bind buttons
	var buttons = document.querySelectorAll('[data-codepen-id]');
	forEachElement(buttons, function (button) {
		var id = button.getAttribute('data-codepen-id');
		if (id) {
			button.addEventListener('click', function (e) {
				openCodepenNS(id);
				e.stopPropagation();
				e.preventDefault();
            });
        }
    });
})(window);