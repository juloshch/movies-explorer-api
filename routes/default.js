const router = require('express').Router();

const { notFoundErr } = require('../controllers/default');

router.all('/*', notFoundErr);

module.exports = router;
