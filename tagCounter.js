const cheerio = require('cheerio');

class TagCounter {
  countTags(html) {
    const $ = cheerio.load(html);
    const tags = {};

    $('*').each((index, element) => {
      const tagName = element.name.trim();
      tags[tagName] = (tags[tagName] || 0) + 1;
    });

    return tags;
  }
}

module.exports = TagCounter;
