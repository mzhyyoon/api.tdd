const express = require('express');
const cmd = require('node-cmd');
const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', (req, res) => {
    cmd.get(
        'mocha ./test/specs/main.spec.js --reporter json --timeout 20000',
        (err, data) => {
            if (err) {
                res.status(500)
                    .json({
                        success: false,
                        result: err
                    })
                    .end();
            } else {
                res.status(200)
                    .json({
                        success: true,
                        result: data
                    })
                    .end();
            }
        }
    );
});

module.exports = router;