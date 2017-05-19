var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user');

router.get('/search/:name', function (req, res, next) {
    
    var name = req.params.name; 
    
    var finder = User.find({ name: new RegExp(name, 'i') });
    finder.select('_id name birthday gender lastLocation');

    finder.exec().then( function (users) {
        
        return res.json({ error: null, users: users });
    }).catch( function (err) {

        return res.json({ error: err });
    });

});

module.exports = router;