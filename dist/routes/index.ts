import express, { Request, Response, NextFunction, Router } from 'express';
import contacto from '../models/contacto';
import db from '../models/sqlite';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        user: any; // Puedes definir un tipo más específico si lo deseas
    }
}
import bcrypt from 'bcryptjs';
dotenv.config();

let router: Router = express.Router();

router.use(session({
    secret:process.env.GOOGLE_CLIENT_SECRET! ,
    resave: false,
    saveUninitialized: false,
}));


router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
  },
  function(accessToken, refreshToken, profile, done) {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    if (!email) {
      return done(null, false, { message: 'No se pudo obtener el email de Google.' });
    }
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'El email no está registrado.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj as any);
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/menuAdmin');
    }
);


function isAuthenticated(req: any, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', (req, res) => {
    res.render('index', { title: 'MoviGo!', siteKey: process.env.RECAPTCHA_SITE_KEY });
});


router.get('/payments', function(req, res) {
    res.render('pagos', { title: 'Compra del Servicio', siteKey: process.env.RECAPTCHA_SITE_KEY });
});

router.get('/login', function(req, res) {
    res.render('sesion', { title: 'Inicio de Sesion de Administradores'});
});

router.get('/menuAdmin', isAuthenticated, (req, res) => {
    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }
    res.render('menuAdmin', { title: 'Menu de Administracion', user: req.user });
});
interface contacto {
    id: number;
    nombre: string;
    email: string;
    mensaje: string;
    ip: string;
    pais: string;
    fecha: Date;

}

interface pagos {
    id: number;
    nombre: string;
    email: string;
    servicio: string;
    monto: number;
    moneda: string;
    fecha: Date;

}

interface User {
    id: number;
    username: string;
    email: string;
    password_hash: any;
    created_at: Date;
}

router.get('/admin/contacts', function (req, res) {
    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }
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

router.get('/admin/pagosRecibidos', function (req, res) {
    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }
    const query = 'SELECT * FROM pagos';

    db.all(query, (err: Error | null, rows: pagos[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Renderizar la vista 'index.ejs' y pasar los resultados de la consulta
        res.render('pagosRecibidos', { title: 'Lista de contactos', pagosRecibidos: rows });
    });
});

router.get('/admin/usuarios', function (req, res) {
    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }
    const query = 'SELECT * FROM usuarios';

    db.all(query, (err: Error | null, rows: User[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Renderizar la vista 'index.ejs' y pasar los resultados de la consulta
        res.render('usuarios', { title: 'Lista de contactos', usuarios: rows });
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
        
    

        contacto.create1(nombre, email, telefono, mensaje, ip, pais, new Date())
            .then(async (id) => {

                const mailOptions = {
                    from: 'neverandagency@gmail.com',
                    to: 'eliannibethpadrino@gmail.com',
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
    const {nombre, email, servicio, tarjeta, mes, ano, cvv, monto, moneda, fecha} = req.body;
    console.log(req.body);
        const datapayment ={
            "amount":parseFloat(monto),
            "card-number":tarjeta,
            "cvv": parseInt (cvv),
            "expiration-month": parseInt (mes),
            "expiration-year": parseInt (ano),
            "full-name": nombre,
            "currency": moneda,
            "description": "Pago por servicio de MovGo!",
            "reference": uuidv4()
        }
        console.log(datapayment);
        try {
            const paymentResponse = await axios.post('https://fakepayment.onrender.com/payments', datapayment,{ headers:{ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzFUMTU6MTg6NTIuODgwWiIsImlhdCI6MTc0ODcwNDczMn0.-7aFpxLfee-JVHPZXfGaXVImBklrkZeulh5MNQjDWqc' }});

            const tarjetaNum = tarjeta;
            const mesNum = parseInt(mes);
            const anoNum = parseInt(ano);
            const cvvNum = parseInt(cvv);
            const montoNum = parseFloat(monto);

            await contacto.create2(
                nombre,
                email,
                servicio,
                tarjetaNum,
                mesNum,
                anoNum,
                cvvNum,
                montoNum,
                moneda,
                new Date,
            );

                res.render('pagos', {
                    title: 'Compra del Servicio',
                    siteKey: process.env.RECAPTCHA_SITE_KEY,
                    paymentResult: paymentResponse.data
                });
            
            } catch (error: any) {
                console.error('Error en el pago:', error.response?.data || error.message);
                res.status(500).send( error.message);
            }
});

router.post('/login', async function (req, res, next) {
    const { username, email, password, created_at } = req.body;
    /*db.get('SELECT * FROM usuarios WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).send('Error en la base de datos');
        console.log(err);
        if (user) return res.status(400).send('El usuario ya está registrado');
        const password_hash = bcrypt.hashSync(password, 10);
        db.run('INSERT INTO usuarios (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, new Date()],
            function (err) {
                if (err) return res.status(500).send('Error al registrar usuario');
                res.redirect('/menuAdmin');
            }
        );
    });*/
    db.get('SELECT * FROM usuarios WHERE username = ?', [username], (err, user: User | undefined) => {
        if (err) return res.status(500).send('Error en la base de datos');
        if (!user || !user.password_hash || !user.email) return res.status(401).send('Usuario, correo o contraseña incorrectos');
        if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).send('Contraseña incorrecta');
        req.session.user = user;
        res.redirect('/menuAdmin');
    });
});
export default router;


