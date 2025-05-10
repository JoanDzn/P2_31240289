import path from 'path';
import sqlite from 'sqlite3';

const db = new sqlite.Database(
    path.resolve(__dirname, '../db', 'contacto.db'),
     error => {
        if (error) {
            return console.log(error.message);
        }

        const sql1 = `CREATE TABLE IF NOT EXISTS contacto (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, email TEXT, telefono INTEGER, mensaje TEXT)`;

        const sql2 = `CREATE TABLE IF NOT EXISTS pagos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, email TEXT, telefono INTEGER, direccion TEXT, tarjeta INTEGER, mes INTEGER, ano INTEGER, cvv INTEGER, monto INTEGER, moneda TEXT)`;

        db.run(sql1, (error) => {
            if (error) {
                return console.log(error);
            }
            
        });

        db.run(sql2, (error) => {
            if (error) {
                return console.log(error);
            }
            
        });
    })

export default db