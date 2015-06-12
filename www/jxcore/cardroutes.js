var express = require('express');

var shortid = require('shortid');

var routes = function(db){
    var cardRouter = express.Router();

    cardRouter.route('/cards')
        .post(function(req,res){
            var newCard = {
                id:shortid.generate(),
                author: req.body.author,
                content: req.body.content
            };
            db.put({
                _id: newCard.id,
                author: newCard.author,
                content: newCard.content
            }, function (err, doc) {
                console.log(doc);
            });
            db.get(newCard.id).then(function (doc) {
                res.status(201).send(doc);
            }).catch(function (err) {
                console.log(err);
            });
        })
        .get(function(req, res){
            var responseJson = { result: 'not supported'};
            res.json(responseJson);
        });

    cardRouter.route('/cards/:cardId')
        .get(function(req,res){
            db.get(req.params.cardId).then(function (err,doc) {
                if(err)
                    res.status(500).send(err);
                else
                    res.json(doc);
            }).catch(function (err) {
                var responseJson = { result: 'doc not found'};
                res.json(responseJson);
            });
        })
        .put(function(req,res){
            db.get(req.params.cardId).then(function(doc) {
                return db.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    content: req.body.content //Update the post card content
                });
            }).then(function(response) {
                var responseJson = { result: 'doc updated'};
                res.json(responseJson);
            }).catch(function (err) {
                console.log(err);
            });
        })
        .delete(function(req, res){
            db.get(req.params.cardId).then(function(doc) {
                return db.remove(doc._id, doc._rev);
            }).then(function (result) {
                var responseJson = { result: 'doc deleted'};
                res.json(responseJson);
            }).catch(function (err) {
                console.log(err);
            });
        });
    return cardRouter;
};

module.exports = routes;