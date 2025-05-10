import db from './sqlite';


export default {
    create1 (nombre: any, email:any, telefono:any, mensaje:any) {
        return new Promise((resolve, reject) => {
            const sql1 = `INSERT INTO contacto (id, nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)`;

            db.run(sql1, [nombre, email, telefono, mensaje], function (error) {
                if (error) reject(error);
            else resolve(this.lastID);
            });
        });
    },

    create2 (nombre: any, email:any, telefono:any, direccion:any, tarjeta:any, mes:any, ano:any, cvv:any, monto:any, moneda:any) {
        return new Promise((resolve, reject) => {
            const sql2 = `INSERT INTO pagos (id, nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.run(sql2, [nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        })             

    }
}
