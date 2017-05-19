var express = require('express');
var router = express.Router();


var _ = require('underscore');
var mongoose = require('mongoose');
var User = require('../models/user');
var TradeRequest = require('../models/tradeRequest');
var Trade = require('../models/trade');
var Item = require('../models/item');

router.get('/traderequests', function (req, res, next) {
    
    var requester = req.user._id;
    var finder = TradeRequest.find({ requester: requester });
    finder.select('_id requester responder requesterItems responderItems status');
    finder.populate('requesterItems.item', 'name');
    finder.populate('responderItems.item', 'name');

    finder.exec().then( function (tRequests) {

        return res.json({ error: null, tradeRequests: tRequests });
    }).catch( function (err) {
      
        return res.json({ error: err });
  });

});

router.get('/traderequests/info', function (req, res, next) {

    var finder = Item.find({});
    finder.select('_id name points');
    finder.exec().then( function (items) {

        return res.json({ error: null, items: items });
    }).catch( function (err) {

        return res.json({ error: err });
    });
});

router.get('/traderequests/:id', function (req, res, next) {
    
    var id = req.params.id;
    var requester = req.user._id;
    var finder = TradeRequest.findOne({ id: id, requester: requester });
    finder.select('_id requester responder requesterItems responderItems status');
    finder.populate('requesterItems.item', 'name');
    finder.populate('responderItems.item', 'name');
    
    finder.exec().then( function (tRequest) {
        
        if (!tRequest) return res.json({ error: null, message: 'Trade request not found' });
        return res.json({ error: null, TradeRequest: tRequest });
    }).catch( function (err) {

        return res.json({ error: err });
    });

});


router.post('/traderequests', function (req, res, next) {
    
    var requester = req.user._id;

    var tradeRequest = new TradeRequest();
    
    tradeRequest.requester = requester;
    tradeRequest.responder = req.body.responder;
    tradeRequest.requesterItems = [];
    tradeRequest.requesterItems = req.body.requesterItems;
    tradeRequest.responderItems = req.body.responderItems;
    
    var requesterPoints;
    var responderPoints;
    // Calculate the points
    /*[{
        item: id, amount: number
    }]*/

    // tradeRequest.status
    
    var finder = User.find({ _id: { "$in": [requester, tradeRequest.responder] } });
    
    finder.select('_id name inventory infected');
    finder.populate('inventory.item', '_id name points');
    
    finder.exec().then( function (users) {
        
        var userRequester = _.find(users, function (obj) { return obj._id.toString() == requester; } );
        var userResponder = _.find(users, function (obj) { return obj._id.toString() == tradeRequest.responder; } );

        // Check that requester have enought items to trade
        _.each(tradeRequest.requesterItems, function (i) {

            var tradeReqItem = i;
            var userReqItem = _.find(userRequester.inventory, function (obj) { return obj.item._id.toString() == i.item.toString() });


            if (i.amount > userReqItem.amount) return res.json({ error: null, message: 'You do not have enought ' + userReqItem.item.name + ' for this exchange' });
        });
        
        // Check that responder have enought items to trade
        _.each(tradeRequest.responderItems, function (i) {

            console.log('second test');
            console.log(i);
            
            var tradeResItem = i;
            var userResItem = _.find(userResponder.inventory, function (obj) { return obj.item._id.toString() == i.item.toString() });
            
            console.log(userResItem);

            if (i.amount > userResItem.amount) return res.json({ error: null, message: 'The responder do not have enought ' + userResItem.item.name + ' for this exchange' });
        });
        
        // Check that the points are equivalent
        
        
        // Check if responder have items to trade
        /*tradeRequest.responderItems.forEach( function (value, index) {

            var tradeResItem = tradeRequest.responderItems.filter( function(o) { return o._id == value; } );
            var userResItem = userResponder.inventory.filter( function(o) { return o._id == value; } );
            
            console.log(tradeResItem);
            console.log(userResItem);

            if (tradeResItem.amount >= userResItem.amount) {
                return res.json({ error: null, message: 'He does not have enought ' + userReqItem.name + ' for this exchange' });
            }
        });*/
    }).catch( function (err) {
        return res.json({ error: err });
    });


    next();
    /*
    user.save().then( function () {
        
        var id = user._id;
        return res.json({ error: null, message: 'Registration completed successfully, your ID:' + id, id: id });
    }).catch( function (err) {

        return res.json({ error: err });
    });
    */
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