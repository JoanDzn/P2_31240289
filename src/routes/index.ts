import express, { NextFunction } from 'express';
import contacto from '../models/contacto';
import pagos from '../models/contacto';


/* GET home page. */
import { Request, Response, Router } from 'express';

let router: Router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'MoviGo!' });
});

router.get('/payments', function (req: Request, res: Response) {
  res.render('pagos', { title: 'Compra del Servicio' });
});



router.post('/contacto', function(req: Request, res: Response, next:NextFunction){
  const {id, nombre, email, telefono, mensaje} = req.body;
  

  console.log(req.body);

  contacto.create1(nombre, email, telefono, mensaje)
  .then((id) => {
    res.redirect('/');
    console.log('prueba 2')
  })

  
  .catch(error => {
    console.error('Error al guardar el contacto:', error);
    return res.status(500).send('Error al guardar el contacto');
  });
});


router.post('/payments', function(req: Request, res: Response, next:NextFunction){
  const {nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
  

  console.log(req.body);

  pagos.create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda)
  .then((id) => {
    res.redirect('/');
    console.log('prueba 2')
  })

  
  .catch(error => {
    console.error('Error al guardar el contacto:', error);
    return res.status(500).send('Error al guardar el contacto');
  });
});
export default router;