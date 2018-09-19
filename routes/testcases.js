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

    if(req.query && req.query.type) {
        getTestcaseByType(testcases, res, {
            $and: [{
                id: decodeURIComponent(req.params.id)
            }, {
                type: req.query.type
            }]
        });
    } else {
        getTestcaseByLast(testcases, res, {
            id: decodeURIComponent(req.params.id)
        });
    }
});

const getTestcaseByLast = (db, response, findOption) => {
    db.find(findOption).sort({
        timestamp: -1
    }).limit(1).toArray((err, testcase) => {
        if (err) {
            throw err;
        }

        if (testcase.length === 0) {
            response.sendStatus(404).end();
        } else {
            response.status(200)
                .json({
                    testcase
                })
                .end();
        }
    });
};

const getTestcaseByType = (db, response, findOption) => {
    db.find(findOption).sort({
        timestamp: -1
    }).toArray((err, testcase) => {
        if (err) {
            throw err;
        }

        if (testcase.length === 0) {
            response.sendStatus(404).end();
        } else {
            response.status(200)
                .json({
                    testcase
                })
                .end();
        }
    });
};

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
        'mocha --recursive ./test/specs/*.js --reporter json --async-only --delay',
        (err, data) => {
            const result = JSON.parse(data);

            console.log('[error] : /test/specs/main.spec.js ', err);

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