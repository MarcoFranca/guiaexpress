const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//bd
const connection = require('./database/database')
// const Category = require('./categories/Category')
// const Article = require('./articles/Article')

//controllers
const categoriesController = require("./categories/categoriesController")
const articlesController = require('./articles/articlesController')

//view engine
app.set('view engine','ejs');

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database

connection.authenticate().then(()=>{
    console.log("conexao com sucesso")
}).catch((err)=> console.log(err))

//controllers

app.use('/',categoriesController)
app.use('/',articlesController)

app.get('/',(req,res)=>{
    res.render('index');
})



app.listen(8000,()=>{
    console.log("o servidor está rodando na porta: 8000")
})