const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
let message = ''
router.get('/admin/users/',(req, res)=>{

    User.findAll().then((users)=>{
    res.render("admin/users/index",{users:users})
    })
})

router.get('/admin/users/create',(req, res)=>{
    res.render('admin/users/create', {
        message:message
    })
})

router.post('/admin/users/create',(req, res)=>{
    const name = req.body.name
    const email = req.body.email
    const passwd = req.body.passwd

    User.findOne({where:{email:email}}).then(user=>{
        if (!user){
            message = ""
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(passwd,salt)

            User.create({
                name:name,
                email:email,
                password: hash
            }).then(()=>{res.redirect('/admin/users')
            }).catch(()=>{res.redirect('/')
            });
        }else {
            message = "Email ja cadastrado"
                res.redirect('/admin/users/create')
        }
    })
})

router.get('/login',(req, res)=>{
    res.render('admin/users/login',{message:message})
})

router.post('/authenticate', (req, res)=>{
    const email = req.body.email;
    const passwd = req.body.passwd;

    User.findOne({ where:{ email : email }}).then(user=>{
        if (user){

            const valPass = bcrypt.compareSync(passwd,user.password);

            if (valPass){
                message = ""
                req.session.user = {
                    id:user.id,
                    email:user.email
                }
                res.redirect('admin/articles');
            }else {
                message = "Email ou senha incorreta"
                res.redirect('/login')
            }
        }else {
            message = "Email ou senha incorreta"
            res.redirect('/login')
        }
    })


})

router.get('/logout',(req, res)=>{
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router;