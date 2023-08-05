# Tag Counter - Desafio de Contagem de Tags HTML

Este é um projeto desenvolvido em Node.js que tem como objetivo contar a quantidade de tags HTML em uma página web, com a possibilidade de fazer essa contagem para várias URLs. O projeto utiliza as seguintes tecnologias: Node.js, Express, Axios, Cheerio, Cors e SQLite3.

## Descrição do desafio

O objetivo do desafio é propor o desenvolvimento de um programa capaz de identificar e contabilizar as tags HTML presentes em páginas web carregadas a partir de uma lista de URLs informada. Para cada URL, o programa deve contar a quantidade de vezes que cada tag aparece na página e armazenar essas informações em um banco de dados para posterior consulta.

## Exemplo

Considerando o seguinte código HTML:

```html
<html>
    <head>
      <title>Teste prático</title>
    </head>
    <body>
      <h1>Olá</h1>
      <p>Teste 1</p>
      <p>Teste 2</p>
      <p>Teste 3</p>
    </body>
</html>
```

Ao processar essa página, o seguinte resultado seria apresentado:

| tag    | quantidade |
| ------ | ---------- |
| html   | 1          |
| head   | 1          |
| title  | 1          |
| body   | 1          |
| h1     | 1          |
| p      | 3          |

## Como rodar o projeto

Para rodar o projeto, é necessário ter o Node.js instalado na sua máquina. Siga os passos abaixo:

1. Clone este repositório para o seu computador:

```
git clone https://github.com/martinsmiguel/tag-counter.git
```

2. Acesse a pasta do projeto:

```
cd tag-counter
```

3. Instale as dependências do projeto (utilizando o `npm` ou `yarn`):

```
npm install
```

```
yarn install
```

4. Inicie o servidor:

```
npx nodemon server.js
```

O servidor estará rodando em `http://localhost:8000`.

## Utilizando a API

Após iniciar o servidor, você poderá utilizar a API para contar as tags HTML em uma lista de URLs. Para fazer uma requisição, utilize o método `GET` para a rota `/fetch-urls`, passando os parâmetros `urls` com a lista de URLs que você deseja analisar.

Exemplo de requisição utilizando cURL:

```bash
curl 'http://localhost:8000/fetch-urls?urls=https://www.example.com,https://www.example.org'
```

O servidor irá processar cada URL da lista, contar as tags HTML presentes em cada página e armazenar essas informações no banco de dados. O resultado será retornado em formato JSON com as URLs e as respectivas contagens de tags:

```json
[
  {
    "url": "https://www.example.com",
    "tags": {
      "html": 1,
      "head": 1,
      "title": 1,
      "body": 1,
      "h1": 1,
      "p": 3
    }
  },
  {
    "url": "https://www.example.org",
    "tags": {
      "html": 1,
      "head": 1,
      "title": 1,
      "body": 1,
      "h1": 1,
      "p": 3
    }
  }
]
```

## Considerações finais

Esse programa é uma solução para contabilizar as tags HTML em páginas web e armazenar as informações em um banco de dados. Ele pode ser facilmente adaptado para incluir mais recursos ou integrar com outras partes de um sistema maior.

Caso tenha alguma dúvida ou sugestão de melhoria, sinta-se à vontade para entrar em contato.