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

    cmd.get(
        'mocha ./test/specs/main.spec.js --reporter json --timeout 20000',
        (err, data) => {
            if (err) {
                res.sendStatus(500).end();
            } else {
                const result = JSON.parse(data);

                testcases.find({
                    _id: ObjectId(req.body.id)
                }).toArray((err, testcase) => {
                    if(err) {
                        throw err;
                    }

                    if(testcase.length === 0) {
                        testcases.insert({
                            id: req.body.userId || "",
                            timestamp: Date.now(),
                            type: req.body.type,
                            result
                        });
                    } else {
                        testcases.update({
                            _id: ObjectId(req.body.id)
                        }, {
                            $set : {
                                timestamp: Date.now(),
                                result
                            }
                        })
                    }

                    res.status(200).end();
                });
            }
        }
    );
});

module.exports = router;