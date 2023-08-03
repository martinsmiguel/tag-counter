const sqlite3 = require('sqlite3').verbose();

class DatabaseService {
  constructor() {
    this.db = new sqlite3.Database('database.db');
    this.createTable();
  }

  createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS pages (
        url TEXT,
        tag TEXT,
        quantity INTEGER
      )`;
    return new Promise((resolve, reject) => {
      this.db.run(createTableQuery, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async insertData(url, tags) {
    const selectQuery = 'SELECT COUNT(*) AS count FROM pages WHERE url = ?';
    const insertQuery = 'INSERT INTO pages (url, tag, quantity) VALUES (?, ?, ?)';

    const count = await new Promise((resolve, reject) => {
      this.db.get(selectQuery, [url], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });

    if (count === 0) {
      return Promise.all(
        Object.entries(tags).map(([tag, quantity]) => {
          return new Promise((resolve, reject) => {
            this.db.run(insertQuery, [url, tag, quantity], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        })
      );
    }
  }

  getDataByUrl(url) {
    const selectQuery = 'SELECT * FROM pages WHERE url = ?';
    return new Promise((resolve, reject) => {
      this.db.get(selectQuery, [url], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || {});
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseService;
