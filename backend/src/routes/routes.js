const express = require('express');
const controller = require('../controller/controller.js');
const controller2 = require('../controller/controller2.js');
const controller3 = require('../controller/controller3.js');

const router = express();

//GETTING MOVIES
router.get(`/get`, controller.getMovies);
router.post(`/add`, controller.addMovie);
router.post(`/delete`, controller.deleteMovie);
router.post(`/edit`, controller.editMovie);

// router.post(`/search`, controller.searchMovie);
router.get(`/search/:name`, controller.searchMovie);

router.get(`/get2`, controller2.getMovies);
router.post(`/add2`, controller2.addMovie);
router.post(`/delete2`, controller2.deleteMovie);
router.post(`/edit2`, controller2.editMovie);
router.post(`/search2`, controller2.searchMovie);

router.get(`/get3`, controller3.getMovies);
router.post(`/add3`, controller3.addMovie);
router.post(`/delete3`, controller3.deleteMovie);
router.post(`/edit3`, controller3.editMovie);
router.post(`/search3`, controller3.searchMovie);

module.exports = router;