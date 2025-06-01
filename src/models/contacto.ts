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

    create2 (
        nombre: string,
        email: string,
        telefono: number,
        tarjeta: number,
        mes: number,
        ano: number,
        cvv: number,
        monto: number,
        moneda: string
    ) {
        return new Promise((resolve, reject) => {
            const sql2 = `INSERT INTO pagos (nombre, email, telefono, tarjeta, mes, ano, cvv, monto, moneda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql2, [nombre, email, telefono, tarjeta, mes, ano, cvv, monto, moneda], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        });
    }
}
