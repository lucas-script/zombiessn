var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user');

router.post('/register', function (req, res, next) {
    
    var user = new User();
    user.name = req.body.name;
    user.birthday = req.body.birthday;
    user.gender = req.body.gender;
    user.lastLocation = req.body.lastLocation;
    user.inventory = req.body.inventory;
    
    user.save().then( function () {
        
        var id = user._id;
        return res.json({ error: null, message: 'Registration completed successfully, your ID:' + id, id: id });
    }).catch( function (err) {

        return res.json({ error: err });
    });
    
});

module.exports = router;