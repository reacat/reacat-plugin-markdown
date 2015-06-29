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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _frontMatter = require('front-matter');

var _frontMatter2 = _interopRequireDefault(_frontMatter);

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
    var fmResult = (0, _frontMatter2['default'])(source.fileContent);
    var frontMatter = fmResult.attributes;
    source.page = mergeFrontMatter.call(_this, {
      frontMatter: frontMatter,
      source: source
    });
    source.htmlContent = (0, _marked2['default'])(fmResult.body);
    source.render = true;
    _this.log.verbose('parseMarkdownFiles', JSON.stringify(source, null, 2));
  });
}

function mergeFrontMatter(options) {
  var frontMatter = options.frontMatter;
  var source = options.source;

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
    frontMatter.permalink = getPermalink.call(this, { source: source });
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