const express = require('express');
const controller = require('../controller/controller.js');

const router = express();

//GETTING MOVIES
router.get(`/get`, controller.getMovies);
router.post(`/add`, controller.addMovie);

module.exports = router;