import express, { Request, Response, NextFunction, Router } from 'express';
import contacto from '../models/contacto';
import db from '../models/sqlite';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let router: Router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'MoviGo!', siteKey: process.env.RECAPTCHA_SITE_KEY  });
});


router.get('/payments', function(req, res) {
    res.render('pagos', { title: 'Compra del Servicio', siteKey: process.env.RECAPTCHA_SITE_KEY });
});

interface contacto {
    id: number;
    nombre: string;
    email: string;
    telefono: number;
    mensaje: string;

}

router.get('/admin/contacts', function (req, res) {
    const query = 'SELECT * FROM contacto';

    db.all(query, (err: Error | null, rows: contacto[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Renderizar la vista 'index.ejs' y pasar los resultados de la consulta
        res.render('contacts', { title: 'Lista de contactos',contactos: rows });
    });
});

interface RecaptchaResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    'error-codes'?: string[];
}

router.post('/contacto', async function (req, res, next) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.userGmail,
            pass: process.env.passwordGmail    
        },
        tls: {
        rejectUnauthorized: false
    }
    });
    const secretkey = process.env.RECAPTCHA_SECRET_KEY;
    const token = req.body['g-recaptcha-response'];
    const recaptchaResponse = await axios.post<RecaptchaResponse>(`https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`);

    if (recaptchaResponse.data.success===true) {

        const { nombre, email, telefono, mensaje } = req.body;
        console.log(req.body);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            let pais = '';

            try {
                const ipstackKey = process.env.ipstackKey;
                const ipstackResponse = await axios.get(`http://api.ipstack.com/${ip}?access_key=${ipstackKey}`);
                const location = ipstackResponse.data as { country_name?: string };
                pais = location.country_name || '';
                console.log('Ubicación del usuario:', location);
            } catch (err) {
                console.error('Error consultando ipstack:', err);
            }
        
    

        contacto.create1(nombre, email, telefono, mensaje, pais)
            .then(async (id) => {

                const mailOptions = {
                    from: 'neverandagency@gmail.com',
                    to: 'programacion2ais@yopmail.com',
                    subject: 'Nuevo contacto desde MoviGo!',
                    text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${mensaje}\nPais: ${pais}\nIP: ${ip}`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    res.redirect('/');
                    console.log('Contacto guardado y correo enviado');
                } catch (error) {
                    console.error('Error al guardar el contacto o enviar el correo:', error);
                    return res.status(500).send('Error al guardar el contacto o enviar el correo');
                }
            })
    }
});




router.post('/payments', async function (req, res, next) {
    const {nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
    console.log(req.body);
        const datapayment ={
            "amount": monto,
            "card-number": tarjeta,
            "cvv": cvv,
            "expiration-month": mes,
            "expiration-year": ano,
            "full-name": nombre,
            "currency": moneda,
            "description": "Pago por servicio de MovGo!",
            "reference": uuidv4()
        }
        console.log( datapayment);
        try {
            const paymentResponse = await axios.post('https://fakepayment.onrender.com/payments', datapayment,{ headers:{ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzFUMTU6MTg6NTIuODgwWiIsImlhdCI6MTc0ODcwNDczMn0.-7aFpxLfee-JVHPZXfGaXVImBklrkZeulh5MNQjDWqc' }});
            
            await contacto.create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda);

                res.render('pagos', {
                    title: 'Compra del Servicio',
                    siteKey: process.env.site_key,
                    paymentResult: paymentResponse.data
                });
            
        } catch (error: any) {
            console.error('Error en el pago:', error.response?.data || error.message);
            res.status(500).send('Error al procesar el pago');
        }
});
export default router;


