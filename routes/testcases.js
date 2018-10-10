const express = require('express');
const router = express.Router();
const db = require('../db');
const cmd = require('node-cmd');

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
        }, {
            page : Number(req.query.page),
            per : Number(req.query.per)
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
                .json(testcase)
                .end();
        }
    });
};

const getTestcaseByType = (db, response, findOption, pageOption = {}) => {
    const dbTestCase = db.find(findOption);
    const {page = 1, per = 10} = pageOption;

    console.log('pageOption :', pageOption);

    dbTestCase
        .sort({
            timestamp: -1
        })
        .skip((page - 1) * per)
        .limit(per)
        .toArray((err, testcases) => {
            if (err) {
                response.status(500).end();
            }

            if (testcases.length === 0) {
                response.sendStatus(404).end();
            } else {
                dbTestCase.count().then((totalCount) => {
                    response.status(200)
                        .json({
                            testcases,
                            totalCount
                        })
                        .end();
                });
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
        'mocha --recursive ./test/specs/*.spec.js --reporter json --no-diff',
        (err, data) => {
            console.log(`[MOCHA TEST FAILURE] : ${err}`);
            const result = JSON.parse(data);
            const testcase = {
                id: req.body.id || "",
                timestamp: Date.now(),
                type: req.body.type,
                result
            };

            try {
                testcases.insertOne(testcase);

                res.status(200)
                    .json(testcase)
                    .end();
            } catch (e) {
                res.status(500).end();
            }
        }
    );
});

module.exports = router;