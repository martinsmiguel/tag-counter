const express = require("express");
const axios = require("axios");
const cors = require("cors");

const TagCounter = require("./tagCounter");
const DatabaseService = require("./databaseService");

const app = express();
const port = 8000;
app.use(cors());

const tagCounter = new TagCounter();
const dbService = new DatabaseService();

async function getTagsData(url) {
  try {
    const data = await dbService.getDataByUrl(url);
    if (data) {
      console.log("Dados encontrados em cache");
      return data;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Erro ao buscar dados do banco de dados:", error);
    throw error;
  }
}

function isValidURL(url) {
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
}

process.on("SIGINT", () => {
  dbService.close();
  console.log("Conexão do banco de dados fechada.");
  process.exit();
});

// Rota para realizar as solicitações HTTP
app.get("/fetch-url", async (req, res) => {
  let { url } = req.query;
  console.log(url);
  if (!url) {
    return res.status(400).json({ error: "URL ausente na requisição" });
  }
  // Verificar se a URL possui um protocolo válido (http ou https)
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Adicionar "http://" como protocolo padrão, já que é o mais comum
    url = "http://" + url;
  }
  if (!isValidURL(url)) {
    return res.status(400).json({ error: "URL inválida" });
  }
  try {
    const response = await axios.get(url);
    const tags = tagCounter.countTags(response.data);
    await dbService.insertData(url, tags);
    res.json(tags);
  } catch (error) {
    console.error("Erro ao buscar URL:", error);
    res.status(500).send("Erro ao buscar URL");
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
