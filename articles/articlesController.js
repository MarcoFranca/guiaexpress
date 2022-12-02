const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('../articles/Article')
const adminAuth = require('../middleware/adminAuth')
const slugify = require('slugify')
//pagination
const itemLimit = 4

router.get('/',(req,res)=>{
    Article.findAll({
        order:[['updatedAt', 'DESC']],
        limit: itemLimit
        }).then(articles=>{
        Category.findAll().then(categories=>{
        res.render('index',{articles:articles, categories:categories});
        })
    })
})


router.get('/admin/articles', adminAuth,(req, res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then((articles)=>{
    res.render("admin/articles/index", {articles:articles})
    })
})

router.get('/admin/articles/new', adminAuth,(req, res)=>{
    Category.findAll().then((categories)=>{
    res.render('admin/articles/new', {categories:categories})
    })
})

router.post('/articles/save', adminAuth,(req, res)=>{
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.category;
    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:categoryId
    }).then(()=>{
        res.redirect('/admin/articles')
    }).catch(err=>{console.log(err)})
})

router.post('/admin/article/delete', adminAuth,(req, res)=>{
    const id = req.body.id;
    if (id && !isNaN(id)){
        Article.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/articles")
        })
    }else {
        res.redirect("/admin/articles")

    }
})

router.get('/admin/articles/edit/:id', adminAuth,(req, res)=>{
    const id = req.params.id
    Article.findByPk(id).then(article=>{
        if (article && !isNaN(id)){
            Category.findAll().then(categories=>{
            res.render("admin/articles/edit",{article:article, categories:categories})
            })
        }else {
            res.redirect("/admin/articles")
        }
    }).catch(err =>{console.log(err)})
})

router.post('/articles/update', adminAuth,(req, res)=> {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.category

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        console.log(err)
        res.redirect('/');
    });
});

router.get('/articles/page/:num',(req, res)=>{
    const page = req.params.num;
    let maxPages = 0
    const offset = (parseInt(page) - 1) * itemLimit
    Article.findAndCountAll({
        limit: itemLimit,
        order:[['updatedAt', 'DESC']],
        offset: offset
    }).then(articles=>{
        maxPages = Math.ceil(parseInt(articles.count) / itemLimit)

        const pagination = {
            page:parseInt(page),
            maxPages: maxPages,
            articles:articles
        }
        Category.findAll().then(categories=>{
            res.render('admin/articles/page',{pagination:pagination, categories:categories})

        })
    })
})
module.exports = router;