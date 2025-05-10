"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database(path_1.default.resolve(__dirname, '../db', 'contacto.db'), error => {
    if (error) {
        return console.log(error.message);
    } else{
        console.log('conexion a la Base de Datos Exitosa!!!');
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
});
exports.default = db;
