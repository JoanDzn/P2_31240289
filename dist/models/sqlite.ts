import path from 'path';
import sqlite from 'sqlite3';

const db = new sqlite.Database(
    path.resolve(__dirname, '../db', 'contacto.db'),
     error => {
        if (error) {
            return console.log(error.message);
        }else {
            console.log('Conectado a la base de datos contacto.db');
        }

        const contact = `CREATE TABLE IF NOT EXISTS contacto (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, email TEXT, telefono INTEGER, mensaje TEXT, ip INTEGER ,pais TEXT, fecha DATETIME DEFAULT CURRENT_TIMESTAMP)`;

        const pays = `CREATE TABLE IF NOT EXISTS pagos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, email TEXT, servicio TEXT, tarjeta INTEGER, mes INTEGER, ano INTEGER, cvv INTEGER, monto INTEGER, moneda TEXT, fecha DATETIME DEFAULT CURRENT_TIMESTAMP)`;

        const users = `CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(100) NOT NULL, email TEXT, password_hash TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;
        db.run(contact, (error) => {
            if (error) {
                return console.log(error);
            }
            
        });

        db.run(pays, (error) => {
            if (error) {
                return console.log(error);
            }
            
        });

        db.run(users, (error) => {
            if (error) {
                return console.log(error);
            }
            
        });
    })

export default db