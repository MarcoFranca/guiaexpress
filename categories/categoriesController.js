const express = require('express');
const router = express.Router();
const Category = require('./Category')
const adminAuth = require('../middleware/adminAuth')
const slugify = require('slugify')

router.get('/admin/categories/new', adminAuth,(req, res)=>{
    res.render("admin/categories/new")
})

router.post('/categories/save', adminAuth,(req, res)=>{
    const title = req.body.title
    if (!title){
        res.redirect('/admin/categories/new')
    }else {
        Category.create({
            title:title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories')
        })
    }
})

router.get('/admin/categories', adminAuth,(req, res)=>{
    Category.findAll().then(categories =>{
    res.render('admin/categories/index',{categories:categories});
    })
})

router.post('/admin/categories/delete', adminAuth,(req, res)=>{
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

router.get('/admin/categories/edit/:id', adminAuth,(req, res)=>{
    const id = req.params.id
    Category.findByPk(id).then(category=>{
        if (category && !isNaN(id)){
            res.render("admin/categories/edit",{category:category})
        }else {
            res.redirect("/admin/categories")
        }
    }).catch(err =>{console.log(err)})
})

router.post('/categories/update', adminAuth,(req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    Category.update({title:title, slug:slugify(title)},{where:{
        id:id
        }}).then(()=>{
            res.redirect("/admin/categories")
    })
})

module.exports = router;