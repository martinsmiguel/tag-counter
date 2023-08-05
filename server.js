const express = require('express');
const axios = require('axios');
const cors = require('cors');

const TagCounter = require('./tagCounter');
const DatabaseService = require('./databaseService');

const app = express();
const port = 8000;
app.use(cors());

const tagCounter = new TagCounter();
const dbService = new DatabaseService();

async function getTagsData(url) {
  try {
    const data = await dbService.getDataByUrl(url);
    if (data) {
      console.log('Dados encontrados em cache');
      return data;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Erro ao buscar dados do banco de dados:', error);
    throw error;
  }
}

function isValidURL(url) {
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
}

function normalizeURLs(urls) {
  return urls.map((url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  });
}

process.on('SIGINT', () => {
  dbService.close();
  console.log('Conexão do banco de dados fechada.');
  process.exit();
});

// Rota para realizar as solicitações HTTP
app.get('/fetch-urls', async (req, res) => {
  let { urls } = req.query;

  if (!urls) {
    return res.status(400).json({ error: 'Lista de URLs ausente na requisição' });
  }

  // Remover espaços em branco antes de dividir as URLs
  // Transformar a lista de URLs em um array e normalizá-las
  const urlList = urls.replace(/\s/g, '').split(',');
  const normalizedUrls = normalizeURLs(urlList);

  // Filtrar e remover URLs inválidas
  const validUrls = normalizedUrls.filter((url) => isValidURL(url));

  if (validUrls.length === 0) {
    return res.status(400).json({ error: 'Nenhuma URL válida foi fornecida' });
  }

  try {
    const results = [];
    for (const url of validUrls) {
      const response = await axios.get(url);
      const tags = tagCounter.countTags(response.data);
      await dbService.insertData(url, tags);
      results.push({ url, tags });
    }

    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar URL:', error);
    res.status(500).send('Erro ao buscar URL');
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
