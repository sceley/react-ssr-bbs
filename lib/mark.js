const Markdown = require('markdown-it');
const hljs = require('highlightjs');
const md = new Markdown({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>'
                );
            } catch (err) {
                logger.error(`highlight: ${err}`);
            }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

module.exports = md;