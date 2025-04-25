import express from 'express';
import path from 'path';
import indexRouter from './routes/index';

const app = express();
const port = 3000;

// esta es la Configuración del motor de las vistas
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

// esta la de los estilos
app.use(express.static(path.join(__dirname, 'public'))); 

// servidor
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});