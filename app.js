const express = require("express");
var bodyParser = require('body-parser')

const dotenv = require("dotenv");
const mysql = require('mysql2');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: 'localhost', // Seu host
    user: 'root',      // Seu usuário do MySQL
    password: 'root', // Sua senha do MySQL
    database: 'teste' // Seu banco de dados
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados MySQL');
  });


app.post("/", (req, res) => {
    var { name, email, phone } = req.body;

    const sql = 'INSERT INTO emails SET name=?, email=?, phone=?';

    db.query(sql, [name, email, phone], (err, result) => {
      if (err) {
        console.error('Erro ao adicionar usuário:', err);
        res.status(500).send('Erro ao adicionar usuário');
        return;
      }
  
    });
    res.send('Usuário adicionado com sucesso');
});

app.listen(process.env.PORT, () => {
    console.log(`Server Listening at http://localhost:${process.env.PORT}`);
});
