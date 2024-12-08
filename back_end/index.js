const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const conexao = require("./infraestrutura/conexao");
const Tabelas = require("./infraestrutura/Tabelas");

// Rotas
const authRoutes = require("./rotas/authRoutes");
const investmentRoutes = require("./rotas/investmentRoutes");
const searchRoutes = require("./rotas/searchRoutes");
const stocks = require("./rotas/stocks");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(session({
    secret: 'auth-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Middleware de sessão e rotas
app.use("/", authRoutes);
app.use("/investments", investmentRoutes); // Corrigido para prefixar corretamente as rotas de investimentos
app.use("/", searchRoutes);
app.use("/", stocks);

conexao.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    } else {
        console.log("Conexão com o banco de dados bem-sucedida.");
        Tabelas.init(conexao);

        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
});
