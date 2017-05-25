var express = require('express');
var Task = require('../models/task');
var User = require('../models/user');
var router = express.Router();

router.route('/')
    .get(function(req, res) {
        Task.find(function(err, tasks) {
            if (err) return res.status(500).send(err);
            return res.send(tasks);
        }).populate('user');

    })
    .post(function(req, res) {
        Task.create(req.body, function(err, task) {
            if (err) return res.status(500).send(err);
            return res.send(task);
        });
    })
    .put(function(req, res) {
        Task.findByIdAndUpdate(req.body.id, {
            completed: true,
            completedDate: Date.now()
        }, function(err, task) {
            if (err) return res.status(500).send(err);
            //User table add taskId to completed

            console.log('user is is', req.body.userId);
            User.findByIdAndUpdate(req.body.userId, { $push: { completedTask: req.body.id } },
                function(err, user) {
                    if (err) {
                        console.log('user not updated', err);
                    } else {
                        console.log('user was updated', user);
                    }
                    return res.send({ task: task });
                });
        });
    });

router.route('/:id')
    .get(function(req, res) {
        Task.findById(req.params.id, function(err, task) {
            if (err) return res.status(500).send(err);
            return res.send(task);
        });
    })
    .delete(function(req, res) {
        Task.findByIdAndRemove(req.params.id, function(err) {
            if (err) return res.status(500).send(err);

            return res.send({ message: 'success' });
        });
    });

module.exports = router;
