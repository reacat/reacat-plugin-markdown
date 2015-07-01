'use strict';

var path = require('path');
var marked = require('marked');
var React = require('react');

var extnames = ['.md', '.markdown'];

function parseMarkdown() {
  Object.keys(this.sources).forEach((function (filePath) {
    var source = this.sources[filePath];
    if (!source.page) return;
    var extname = path.extname(filePath).toLowerCase();
    if (extnames.indexOf(extname) === -1) return;
    var markdownContent = source.page.Content;
    var Content = React.createClass({
      displayName: 'Content',

      render: function render() {
        return React.createElement('article', { dangerouslySetInnerHTML: { __html: marked(markdownContent) } });
      }
    });
    source.page.Content = Content;
    this.log.verbose('parseMarkdown', source.page.Content);
  }).bind(this));
}

module.exports = parseMarkdown;