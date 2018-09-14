const express = require('express');
const router = express.Router();
const db = require('../db');
const cmd = require('node-cmd');
const ObjectId = require('mongodb').ObjectId;

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/:id', (req, res) => {
    const testcases = db.get().collection('testcases');

    testcases.find({
        id: decodeURIComponent(req.params.id)
    }).sort({
        timestamp: -1
    }).limit(1).toArray((err, testcase) => {
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

router.get('/timestamps/:id', (req, res) => {
    const testcases = db.get().collection('testcases');

    const findOption = {
        id: decodeURIComponent(req.params.id)
    };

    if(req.query && req.query.date) {
        findOption.timestamp = req.query.date;
    }

    testcases
        .find(findOption)
        .toArray((err, testcase) => {
            if(err) {
                throw err;
            }

            if(testcase.length === 0) {
                res.sendStatus(404).end();
            } else {
                res.status(200)
                    .json({
                        timestamp : testcase.map(testcase => testcase.timestamp)
                    })
                    .end();
            }
        });
});

router.post('/', (req, res) => {
    const testcases = db.get().collection('testcases');

    cmd.get(
        'mocha ./test/specs/main.spec.js --reporter json --timeout 20000',
        (err, data) => {
            const result = JSON.parse(data);

            testcases.insert({
                id: req.body.userId || "",
                timestamp: Date.now(),
                type: req.body.type,
                result
            });

            res.status(200).end();
        }
    );
});

module.exports = router;