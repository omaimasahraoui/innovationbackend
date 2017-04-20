var config = require('config.json');
var _ = require('lodash');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('articles');

var service = {};


service.getAll = getAll;
service.getById = getById;
service.createArticle = createArticle;
service.update = update;
service.delete = _delete;

module.exports = service;



function getAll() {
    var deferred = Q.defer();

    db.articles.find().toArray(function (err, articles) {
        if (err) deferred.reject(err.name + ': ' + err.message);


        deferred.resolve(articles);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.articles.findById(_id, function (err, article) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (article) {
       
            // article not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function createArticle(articleParam) {
    var deferred = Q.defer();
        db.articles.insert(
            articleParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    return deferred.promise;
}

function update(_id, articleParam) {
    var deferred = Q.defer();

    // validation
    db.articles.findById(_id, function (err, article) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (article.title !== articlerParam.title) {
            // articletitle has changed so check if the new articletitle is already taken
            db.articles.findOne(
                { title: articleParam.title },
                function (err, article) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (article) {
                        // articletitle already exists
                        deferred.reject('Article Title "' + req.body.title + '" is already taken')
                    } else {
                        updateArticle();
                    }
                });
        } else {
            updateArticle();
        }
    });

    function updateArticle() {
        // fields to update
        var set = {
    title: articleParam.title, 
    Introduction: articleParam.Introduction,
    corps:articleParam.corps,
    url_img: articleParam.url_img,
    add_date: articleParam.add_date,


        };

      
        db.articles.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.articles.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}