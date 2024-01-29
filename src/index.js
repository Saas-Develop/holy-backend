import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import { connectDatabase } from './database/db.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
}));
app.use("/uploads", (req, res, next) => {
    console.log("Request to /uploads", req.url);
    express.static(path.join(__dirname, "../uploads"))(req, res, next);
  });
app.use(cors())
app.use(routes)

connectDatabase()
    .then(() => {
        console.log("Banco de dados do Holy conectado! 🚀")
    })
    .catch(err => console.log(`Sem conexão, ${err} 🤯`))

app.listen(3002, () => {
    console.log(`Servidor rodando na porta 3002`)
})