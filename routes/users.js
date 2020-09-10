const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const {name, email, password, password2 } = req.body;

    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Tous les champs sont obligatoires'})
    }
    if(password !== password2) {
        errors.push({msg: 'les mots de passes ne correspondent pas'});
    }
    if(password.length < 6) {
        errors.push({msg: 'le mot de passe doit faire 6 caractères au minimum'});
    }
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email})
            .then(user => {
                if(user) {
                    errors.push({msg: 'L\'email est déjà utilisé' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'Vous êtes maintenant enregistré et pouvez vous connecter');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err))
                    }))
                    
                }
            });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local',  {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Vous êtes déconnecté');
    res.redirect('/users/login');
});

module.exports= router;