const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
var cors = require('cors')
const sqlite3 = require('sqlite3').verbose();


const app = express();
const port = 8000;
app.use(cors());

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

async function getTagsData(url) {
  return new Promise(async (resolve, reject) => {
    const db = new sqlite3.Database('database.db');
    db.get('SELECT * FROM pages WHERE url = ?', [url], async (err, row) => {
      if (row) {
        console.log('Data found in the cache');
      } else {
        resolve({})
      }
    });
    db.close();
  });
}


// Rota para realizar as solicitações HTTP
app.get('/fetch-url', async (req, res) => {
  const { url } = req.query;
  if(!url){
    return res.json({error:'Sem Url'})
    // Todo: verificar se existe
  }

  const data = await getTagsData(url);
  try {
    const response = await axios.get(url);
    const tags = await countTags(response.data)
    insertData(url, tags)
    res.json(tags);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).send('Error fetching URL');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
