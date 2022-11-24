const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database')

//view engine
app.set('view engine','ejs');

//static
app.set(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database

connection.authenticate().then(()=>{
    console.log("conexao com sucesso")
}).catch((err)=> console.log(err))

app.get('/',(req,res)=>{
    res.render('index');
})

app.listen(8080,()=>{
    console.log("o servidor está rodando!")
})