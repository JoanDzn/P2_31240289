"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contacto_1 = __importDefault(require("../models/contacto"));
const router = express_1.default.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Hola Mundo :P' });
});
router.use(express_1.default.urlencoded({ extended: true }));

router.get('/pagos', function(req, res) {
    res.render('pagos', { title: 'Compra del Servicio' });
});

router.post('/contacto', function (req, res, next) {
    const { nombre, email, telefono, mensaje } = req.body;

    console.log(req.body);

    contacto_1.default.create1(nombre, email, telefono, mensaje)
        .then((id) => {
        res.redirect('/');
        console.log('prueba 2');
    })
        .catch(error => {
        console.error('Error al guardar el contacto:', error);
        return res.status(500).send('Error al guardar el contacto');
    });
});




router.post('/pagos', function (req, res, next) {
    const { nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
    console.log(req.body);
    
    contacto_1.default.create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda)
        .then((id) => {
        res.redirect('/pagos');
        console.log('prueba 3');
    })
        .catch(error => {
        console.error('Error al guardar el contacto:', error);
        return res.status(500).send('Error al guardar el contacto');
    });
});
exports.default = router;
