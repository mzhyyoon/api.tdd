const express = require('express');
const router = express.Router();
const db = require('../db');
const ObjectId = require('mongodb').ObjectId;

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/:id', (req, res) => {
    const user = db.get().collection('users');

    user.find({
        id : decodeURIComponent(req.params.id)
    }).toArray((err, user) => {
        if(err) {
            throw err;
        }

        if(user.length === 0) {
            res.sendStatus(404).end();
        } else {
            res.status(200)
                .json({
                    user
                })
                .end();
        }
    });
});

router.post('/', (req, res) => {
    const user = db.get().collection('users');

    console.log(req.body.password);

    user.find({
        email : decodeURIComponent(req.body.email)
    }).toArray((err, user) => {
        if(err) {
            throw err;
        }

        console.log(user);

        if(user.length === 0) {
            res.status(406)
                .json({
                    errors : {
                        message: 'Please Check. Id or Password.'
                    }
                })
                .end();
        } else {
            res.status(200)
                .json({
                    user
                })
                .end();
        }
    })
});

router.post('/signup', (req, res) => {
    console.log('signup!!');
    console.log(req.body);
    const dbUser = db.get().collection('users');

    dbUser.find({
        email: decodeURIComponent(req.body.email)
    }).toArray((err, user) => {
        console.log(user);
        if (err) {
            throw err;
        }

        if (user.length !== 0) {
            res.status(500)
                .json({
                    errors: {
                        message: 'It is an already registered email. '
                    }
                })
                .end();
        } else {
            const userInfo = {
                id: req.body.id,
                email: req.body.email,
                password: req.body.password,
                name: req.body.id,
                position: 'Tester',
                level: '3',
                isBookMark: false,
                timestamp: Date.now(),
                profileImage: ''
            }
            dbUser.insertOne(userInfo);

            res.status(200)
                .json({
                    success : true,
                    user : [userInfo]
                })
                .end();
        }
    })
});


module.exports = router;