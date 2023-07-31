const axios = require('axios');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();

// Função para obter o conteúdo HTML de uma URL
async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar a URL ${url}: ${error.message}`);
    return null;
  }
}

// Função para contar as ocorrências das tags HTML
function countTags(html) {
  const $ = cheerio.load(html);
  const tags = {};

  $('*').each((index, element) => {
    const tagName = element.name;
    tags[tagName] = (tags[tagName] || 0) + 1;
  });

  return tags;
}

// Função para inserir os dados no banco de dados
function insertData(url, tags) {
  const db = new sqlite3.Database('database.db');

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS pages (url TEXT, tag TEXT, quantity INTEGER)');

    Object.entries(tags).forEach(([tag, quantity]) => {
      db.run('INSERT INTO pages (url, tag, quantity) VALUES (?, ?, ?)', [url, tag, quantity]);
    });
  });

  db.close();
}

// URLs para testar o processamento
const urls = [
  'https://react.dev/community',
  'https://www.conventionalcommits.org/en/v1.0.0/',
];

// Processamento das URLs
async function processURLs() {
  for (const url of urls) {
    const html = await fetchHTML(url);

    if (html) {
      const tags = countTags(html);
      insertData(url, tags);
      console.log(`URL ${url} processada com sucesso!`);
    } else {
      console.log(`Não foi possível obter o conteúdo da URL ${url}`);
    }
  }
}

processURLs();
