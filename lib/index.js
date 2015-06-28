'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var PERMALINK_REGEXP = /:([a-zA-Z0-9-_]+)/g;
var extnames = ['.md', '.markdown'];

function parseMarkdownFiles() {
  var _this = this;

  Object.keys(this.sources).forEach(function (filePath) {
    var source = _this.sources[filePath];
    var extname = _path2['default'].extname(filePath).toLowerCase();
    if (extnames.indexOf(extname) === -1) {
      return;
    }
    var fileContentSplitResult = source.fileContent.split('---');
    var frontMatterContent = '';
    var markdownContent = '';
    if (fileContentSplitResult.length === 1) {
      markdownContent = fileContent;
    } else {
      if (fileContentSplitResult[0].trim() === '') fileContentSplitResult.shift();
      frontMatterContent = fileContentSplitResult[0];
      fileContentSplitResult.shift();
      markdownContent = fileContentSplitResult.join('---');
    }
    source.page = parseFrontMatter.call(_this, {
      frontMatterContent: frontMatterContent,
      source: source
    });
    source.htmlContent = (0, _marked2['default'])(markdownContent);
    source.render = true;
    _this.log.verbose('parseMarkdownFiles', JSON.stringify(source, null, 2));
  });
}

function parseFrontMatter(options) {
  var frontMatterContent = options.frontMatterContent;
  var source = options.source;

  var frontMatter = _jsYaml2['default'].safeLoad(frontMatterContent);
  if (!frontMatter) frontMatter = {};
  if (!frontMatter.layout) {
    frontMatter.layout = 'index';
  }
  if (!frontMatter.title) {
    var title = source.filePath;
    title = _path2['default'].basename(title, _path2['default'].extname(title));
    title = _capitalize2['default'].words(title.replace(/[-_]/g, ' '));
    frontMatter.title = title;
  }
  if (!frontMatter.permalink) {
    frontMatter.permalink = getPermalink.call(this, {
      source: source
    });
  }
  if (!frontMatter.date) {
    var fileStat = _fsExtra2['default'].statSync(source.filePath);
    var date = (0, _moment2['default'])(fileStat.birthtime).format(this.config.date_format);
    frontMatter.date = date;
  } else {
    frontMatter.date = (0, _moment2['default'])(frontMatter.date).format(this.config.date_format);
  }
  return frontMatter;
}

function getPermalink(options) {
  var source = options.source;
  var relative = _path2['default'].relative(_path2['default'].resolve(this.cwd, this.config.source_dir), source.filePath);
  var permalinkVariables = {
    path: _path2['default'].join('/', _path2['default'].dirname(relative), _path2['default'].basename(relative, _path2['default'].extname(relative)))
  };
  return this.config.permalink.replace(PERMALINK_REGEXP, function (arg0, key) {
    return permalinkVariables[key];
  });
}

exports['default'] = parseMarkdownFiles;
module.exports = exports['default'];