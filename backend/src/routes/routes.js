const express = require('express');
const controller = require('../controller/controller.js');

const router = express();

//GETTING MOVIES
router.get(`/get`, controller.getMovies);
router.post(`/add`, controller.addMovie);
router.post(`/delete`, controller.deleteMovie);
router.post(`/edit`, controller.editMovie);
router.post(`/search`, controller.searchMovie);

module.exports = router;