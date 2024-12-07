const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http")
const conexao = require("./infraestrutura/conexao");
const Tabelas = require("./infraestrutura/Tabelas");


// rotas

const authRoutes = require("./rotas/authRoutes")
const investmentRoutes = require("./rotas/investmentRoutes")
const searchRoutes = require("./rotas/searchRoutes")
const stocks = require("./rotas/stocks")



const app = express();
const server = http.createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/",authRoutes)
app.use("/",investmentRoutes)
app.use("/",searchRoutes)
app.use("/",stocks)



conexao.connect(erro=>{
    if (erro) {
      console.log(erro);
        
    } else {
        console.log("Conexão com o banco de dados bem-sucedida.");
        Tabelas.init(conexao);

        server.listen(4000,()=>{
            console.log("Servidor ligado na porta 3000");
            
        })
    }
})