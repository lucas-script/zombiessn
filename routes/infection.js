var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user');
var InfectionReport = require('../models/infectionReport');

var MAX_REPORTS = 3; 

router.get('/infection/report/:id', function (req, res, next) {
    
    var id = req.params.id;
    var reporter = req.user;

    if (id === reporter._id.toString()) return res.json({ error: null, message: 'You cant report your self' });

    // find previous report
    var finder = InfectionReport.findOne({ user: id });
    
    finder.exec().then( function (iReport) {
        if (!iReport) {
            
            var newInfectionReport = new InfectionReport();
            newInfectionReport.user = id;
            newInfectionReport.reports = 1;
            newInfectionReport.reporters.push(reporter);

            newInfectionReport.save().then( function () {
                
                return res.json({ error: null, message: 'Infection report submitted, this user has ' + newInfectionReport.reports + ' reports'});
            }).catch( function (err) {

                return res.json({ error: err });
            });

        } else {

            // This user has already made a report
            if (iReport.reporters.indexOf(reporter._id) !== -1) {
                return res.json({ error: null, message: 'You has already made a report, this user has ' + iReport.reports + ' reports'});
            }

            iReport.reports++;
            iReport.reporters.push(reporter);

            iReport.save().then( function () {

                // Flag user as infected
                if (iReport.reports >= MAX_REPORTS) {

                    var finder2 = User.findById(id);
                    finder2.exec().then( function (user) {
                        user.infected = true;
                        
                        return res.json({ error: null, message: 'Infection report submitted, This user is flagged as infected'});
                    }).catch( function (err) {

                        return res.json({ error: err});
                    });

                } else {

                    return res.json({ error: null, message: 'Infection report submitted, this user has ' + iReport.reports + ' reports'});
                }

            }).catch( function (err) {

                return res.json({ error: err });
            });
        }

    }).catch( function (err) {

        return res.json({ error: err });
    });
});

module.exports = router;