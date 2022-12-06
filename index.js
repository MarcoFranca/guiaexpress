const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const PORT = process.env.PORT || 8080;

//bd
const connection = require('./database/database');
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');

//controllers
const categoriesController = require("./categories/categoriesController");
const articlesController = require('./articles/articlesController');
const usersController = require('./users/usersController');
const {router} = require("express/lib/application");

//view engine
app.set('view engine','ejs');

//session

app.use(session({
    secret:"cachorromolhado",
    cookie:{ maxAge: 60 * 60000}
}))

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database

connection.authenticate().then(()=>{
    console.log("conexao com sucesso");
}).catch((err)=> console.log(err));

//controllers

app.use('/',categoriesController);
app.use('/',articlesController);
app.use('/',usersController);



app.get('/:slug',(req, res)=>{
    const slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then((article)=>{
        if(article){
            Category.findAll().then(categories=>{
            res.render('article',{ article: article, categories:categories });
            })
        }else {
            res.redirect('/');
        }
    }).catch(err=> {
        console.log(err)
        res.redirect('/');
    })
})

app.get('/category/:slug',(req, res)=>{
    const slug = req.params.slug;
    Category.findOne({where:{
        slug:slug
        },
    include:[{model: Article}]
    }).then(category =>{
        if (category){
            Category.findAll().then(categories=>{
                res.render('index',{articles: category.articles, categories:categories});
            });
        }else {
            res.redirect('/');
        }
    }).catch(err=>{
        console.log(err)
        res.redirect("/");
    })
})



app.listen(PORT,()=>{
    console.log("o servidor está rodando na porta: ", PORT);
})