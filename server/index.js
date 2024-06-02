// Importa bibliotecas necessárias
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config"; // variaveis de ambiente
import routes from "./src/routes/indexRoute.js";  // rotas de aplicação

const app = express();  // Inicializa uma aplicação Express

// Configurações de middleware
app.use(cors({ origin: '*' }));  // Permite requisições de qualquer origem
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));  
app.use(cookieParser()); 

// Define as rotas da API
app.use("/api", routes);

const port = process.env.PORT || 3000;  // Define a porta do servidor a partir de uma variável de ambiente ou usa a porta 3000 como padrão

const server = http.createServer(app);  // Cria um servidor HTTP com a aplicação Express


// Conecta ao banco de dados MongoDB e inicia o servidor
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Mongodb conectado");
  server.listen(port, () => {
    console.log(`Servidor online na porta ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);  // Encerra o processo com erro se a conexão ao MongoDB falhar
});
