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

module.exports = router;