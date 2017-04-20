var config = require('../config');
var express = require('express');
var router = express.Router();
var articleService = require('../services/article.service');

// routes

router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/', createArticle);

module.exports = router;
function createArticle(req,res) {
    articleService.createArticle(req.body.title,req.body.introduction,req.body.corps)
        .then(function(articles) {
            res.send(articles);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    articleService.getAll()
        .then(function(articles) {
            res.send(articles);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    articleService.getById(req.article.sub)
        .then(function(user) {
            if (article) {
                res.send(article);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    articleService.update(req.params._id, req.body)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    articleService.delete(req.params._id)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}