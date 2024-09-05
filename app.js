const express = require("express");
var bodyParser = require('body-parser');
const dotenv = require("dotenv");
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const multer = require('multer');

const upload = multer();
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "teste@heloplantier.com",
    pass: process.env.PASS,
  },
});

app.post("/", upload.none(), (req, res) => {
  var { name, email } = req.body;
  const db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DATABASE
  });

  
  transporter.sendMail(
      {
        from: "teste@heloplantier.com",
        to: email,
        replyTo: "teste@heloplantier.com",
        subject: "OBRIGADO",
        text: `
          its working bro?`
      },
      (err, info) => {
        console.log(info);
        console.log(err);
      },
    );
  
  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados MySQL');
  });

  const sql = 'INSERT INTO user SET name=?, email=?';

  db.query(sql, [name, email], (err) => {
    if (err) {
      console.error('Erro ao adicionar usuário:', err);
      res.status(500).send('Erro ao adicionar usuário');
      return;
    }
  });
    res.redirect('https://heloplantier.com/obrigado');
});


app.listen(process.env.PORT, () => {
    console.log(`Server Listening at http://localhost:${process.env.PORT} + + `);
});

function runQuery (con, sqlQuery) {
    return new Promise((resolve, reject) => {
        console.log("START");
        if(con){
            con.connect(function (err) {
                if (err) throw err;
            });

            if (sqlQuery) {
                con.query(sqlQuery, function (error, result, fields) {
                    // con.end(); // end connection
                    if (error) {
                        throw error;
                    } else {
                        return resolve(result);
                    }
                });
            }
        }

    });

}
