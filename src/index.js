var path = require('path');
var marked = require('marked');
var React = require('react');

var extnames = ['.md', '.markdown'];

function parseMarkdown() {
  Object.keys(this.sources).forEach((function(filePath) {
    var source = this.sources[filePath];
    if (!source.page) return;
    var extname = path.extname(filePath).toLowerCase();
    if (extnames.indexOf(extname) === -1) return;
    var markdownContent = source.page.content;
    source.page.content = React.createClass({
      displayName: 'Content',
      render: function() {
        return <article dangerouslySetInnerHTML={{__html: marked(markdownContent)}}/>;
      }
    });
    this.log.verbose('parseMarkdown', source.page.content);
  }).bind(this));
}

module.exports = parseMarkdown;
