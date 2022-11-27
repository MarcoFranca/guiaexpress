const express = require('express');
const router = express.Router();
const Category = require('./Category')
const slugify = require('slugify')

router.get('/admin/categories/new', (req, res)=>{
    res.render("admin/categories/new")
})

router.post('/categories/save',(req, res)=>{
    const title = req.body.title
    if (!title){
        res.redirect('/admin/categories/new')
    }else {
        Category.create({
            title:title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/')
        })
    }
})

router.get('/admin/categories',(req, res)=>{
    Category.findAll().then(categories =>{
    res.render('admin/categories/index',{categories:categories});
    })
})

router.post('/admin/categories/delete',(req, res)=>{
    const id = req.body.id;
    if (id && !isNaN(id)){
        Category.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/categories")
        })
    }else {
        res.redirect("/admin/categories")

    }
})

module.exports = router;