"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const port = 3000;
// esta es la Configuración del motor de las vistas
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// esta la de los estilos
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// servidor
app.use('/', index_1.default);
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
