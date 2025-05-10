"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = __importDefault(require("./sqlite"));
exports.default = {
    create1(nombre, email, telefono, mensaje) {
        return new Promise((resolve, reject) => {
            const sql1 = `INSERT INTO contacto (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)`;
            sqlite_1.default.run(sql1, [nombre, email, telefono, mensaje], function (error) {
                if (error)
                    reject(error);
                else
                    resolve(this.lastID);
            });
        });
    },

    create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda) {
        return new Promise((resolve, reject) => {
            const sql2 = `INSERT INTO pagos (nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            sqlite_1.default.run(sql2, [nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda], function (error) {
                if (error)
                    reject(error);
                else
                    resolve(this.lastID);
            });
        });
    }
};
