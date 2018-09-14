const express = require('express');
const router = express.Router();
const db = require('../db');
const ObjectId = require('mongodb').ObjectId;

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/:id', (req, res) => {
    const testcases = db.get().collection('testcases');

    testcases.find({
        id: decodeURIComponent(req.params.id)
    }).toArray((err, testcase) => {
        if(err) {
            throw err;
        }

        if(testcase.length === 0) {
            res.sendStatus(404).end();
        } else {
            res.status(200)
                .json({
                    testcase
                })
                .end();
        }
    });
});

router.post('/', async (req, res) => {
    const testcases = db.get().collection('testcases');

    fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api-tdd-test.herokuapp.com'}/${req.body.type}`)
        .then((res) => res.json())
        .then((resJSON) => {
            testcases.update({
                _id: ObjectId(req.body.id),
                result: JSON.parse(
                    JSON.stringify(resJSON.result)
                )
            });

            res.sendStatus(200).end();
        })
        .catch(() => res.sendStatus(500).end());
});

module.exports = router;