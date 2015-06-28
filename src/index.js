import path from 'path';
import marked from 'marked';
import capitalize from 'capitalize';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import moment from 'moment';

const PERMALINK_REGEXP = /:([a-zA-Z0-9-_]+)/g;
const extnames = ['.md', '.markdown'];

function parseMarkdownFiles() {
  Object.keys(this.sources).forEach((filePath) => {
    const source = this.sources[filePath];
    const extname = path.extname(filePath).toLowerCase();
    if (extnames.indexOf(extname) === -1) {
      return;
    }
    let fileContentSplitResult = source.fileContent.split('---');
    let frontMatterContent = '';
    let markdownContent = '';
    if (fileContentSplitResult.length === 1) {
      markdownContent = fileContent;
    } else {
      if (fileContentSplitResult[0].trim() === '') fileContentSplitResult.shift();
      frontMatterContent = fileContentSplitResult[0];
      fileContentSplitResult.shift();
      markdownContent = fileContentSplitResult.join('---');
    }
    source.page = parseFrontMatter.call(this, {
      frontMatterContent,
      source
    });
    source.htmlContent = marked(markdownContent);
    source.render = true;
    this.log.verbose('parseMarkdownFiles', JSON.stringify(source, null, 2));
  });
}

function parseFrontMatter(options) {
  const {
    frontMatterContent,
    source
  } = options;
  let frontMatter = yaml.safeLoad(frontMatterContent);
  if (!frontMatter) frontMatter = {};
  if (!frontMatter.layout) {
    frontMatter.layout = 'index';
  }
  if (!frontMatter.title) {
    let title = source.filePath;
    title = path.basename(title, path.extname(title));
    title = capitalize.words(title.replace(/[-_]/g, ' '));
    frontMatter.title = title;
  }
  if (!frontMatter.permalink) {
    frontMatter.permalink = getPermalink.call(this, {
      source
    });
  }
  if (!frontMatter.date) {
    const fileStat = fs.statSync(source.filePath);
    const date = moment(fileStat.birthtime).format(this.config.date_format);
    frontMatter.date = date;
  } else {
    frontMatter.date = moment(frontMatter.date).format(this.config.date_format);
  }
  return frontMatter;
}

function getPermalink(options) {
  const source = options.source;
  const relative = path.relative(path.resolve(this.cwd, this.config.source_dir), source.filePath);
  const permalinkVariables = {
    path: path.join('/', path.dirname(relative), path.basename(relative, path.extname(relative)))
  };
  return this.config.permalink.replace(PERMALINK_REGEXP, (arg0, key) => {
    return permalinkVariables[key];
  });
}

export default parseMarkdownFiles;
