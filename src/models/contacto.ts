import db from './sqlite';


export default {
    create1 (nombre: string, email:string, telefono:number, mensaje:string, ip:any, pais:string, fecha: Date) {
        return new Promise((resolve, reject) => {
            const sql1 = `INSERT INTO contacto (nombre, email, telefono, mensaje, ip ,pais, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            db.run(sql1, [nombre, email, telefono, mensaje, ip, pais, fecha], function (error) {
                if (error) reject(error);
            else resolve(this.lastID);
            });
        });
    },

    create2 (nombre: string, email:string, servicio:string, tarjeta:number, mes:number, ano:number, cvv:number, monto:number, moneda:string, fecha: Date) {
        return new Promise((resolve, reject) => {
            const sql2 = `INSERT INTO pagos (nombre, email, servicio, tarjeta, mes, ano, cvv, monto, moneda, fecha) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

            db.run(sql2, [nombre, email, servicio, tarjeta, mes, ano, cvv, monto, moneda, fecha], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        })             

    },

    create3 (username: string, email:string, password_hash:any, created_at: Date) {
        return new Promise((resolve, reject) => {
            const sql2 = `INSERT INTO usuarios (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)`;

            db.run(sql2, [username, email, password_hash, created_at], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        })             

    }
}
