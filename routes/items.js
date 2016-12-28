var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Item = require('../models/item');

/* GET users listing. */
router.get('/items', function(req, res, next) {
  
  var finder = Item.find({});
  finder.select('_id name points');

  finder.exec().then( function (items) {

    return res.json({error: null, items: items});
  }).catch( function (err) {

    return res.json({error: err})
  });

});

module.exports = router;
