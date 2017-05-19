var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user');
var TradeRequest = require('../models/tradeRequest');
var Trade = require('../models/trade');

router.get('/users', function (req, res, next) {
    
    var finder = User.find({});
    finder.select('_id name birthday gender');

    finder.exec().then( function (users) {

        if (!users) return res.json({ error: null, message: 'User not found' });
        return res.json({ error: null, users: users });
    }).catch( function (err) {
      
        return res.json({ error: err });
  });

});

router.get('/users/:id', function (req, res, next) {
    
    var id = req.params.id; 
    var finder = User.findById(id);
    finder.select('_id name birthday gender lastLocation inventory infected');
    finder.populate('inventory.item', 'name');

    finder.exec().then( function (user) {
        
        if (!user) return res.json({ error: null, message: 'User not found' });
        return res.json({ error: null, user: user });
    }).catch( function (err) {

        return res.json({ error: err });
    });

});

router.post('/users', function (req, res, next) {
    
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

router.put('/users/updatelocation/:id', function (req, res, next) {
    
    var id = req.params.id;
    var finder = User.findById(id);
    finder.select('lastLocation');

    finder.exec().then( function (user) {

        if (!user) return res.json({ error: null, message: 'User not found' });
        if (req.body.lastLocation) user.lastLocation = req.body.lastLocation;

        user.save().then( function () {
            
            return res.json({ error: null, message: 'Last location updated'} );
        }).catch( function (err) {

            return res.json({ error: err });
        });

    }).catch( function () {

        return res.json({ error: err });
    });
});

module.exports = router;