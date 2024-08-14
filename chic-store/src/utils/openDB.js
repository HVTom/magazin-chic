// openDB.js
import sqlite3 from 'sqlite3';

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./chic_store.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
};

export default openDatabase;