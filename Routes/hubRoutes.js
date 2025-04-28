const router = require('express').Router();

const {
    index
} = require('../Controllers/hubController');

router.get('/', index);

module.exports = router;