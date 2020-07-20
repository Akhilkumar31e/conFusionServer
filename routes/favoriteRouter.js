const express = require('express');
const bodyParser = require('body-parser');
//Including mongoose
const mongoose = require('mongoose');
//Including model Dishes
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter= express.Router();

favoriteRouter.use(bodyParser.json());
var app = express();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res, next) => {
    Favorites.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then(( favorites )=> {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err)=> next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if(favorite!=null){
            for(var i=0;i<req.body.length;i++){
                if(favorite.dishes.indexOf(req.body[i]._id)==-1){
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .then((favorite) => {
                        res.statusCode=200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
            }, (err)=> next(err));
        }
        else{
            const newFav = {
                user : req.user._id,
                dishes : []
            }
            for(var i=0;i<req.body.length;i++){
                if(newFav.dishes.indexOf(req.body[i]._id)==-1){
                    newFav.dishes.push(req.body[i]._id);
                }
            }
            Favorites.create(newFav)
            .then((favorite) => {
                console.log('Favorites added  ', favorite);
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err)=> next(err))
            .catch((err) => next(err)); 
        }
    });
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res, next) => {
    Favorites.remove({user:req.user._id})
   .then((resp) => {
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
   }, (err)=> next(err))
   .catch((err) => next(err));
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if(favorite!=null){
            if(favorite.dishes.indexOf(req.params.dishId)==-1){
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .then((favorite) => {
                        res.statusCode=200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                }, (err)=> next(err));
            }
            else{
                err = new Error(req.params.dishId+' was already added into favorites');
                err.status = 404;
                return next(err);
            }
        }
        else{
            const newFav = {
                user : req.user._id,
                dishes : [req.params.dishId]
            }
            Favorites.create(newFav)
            .then((favorite) => {
                console.log('Favorite added  ', favorite);
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err)=> next(err))
            .catch((err) => next(err)); 
        }
    });
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if(favorite!=null && favorite.dishes.indexOf(req.params.dishId)!=-1){
            favorite.dishes.remove(req.params.dishId);
            favorite.save()
            .then((favorite) => {
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err)=> next(err));
        }
        else{
            err = new Error(req.params.dishId+' not found');
            err.status = 404;
            return next(err);
        }
    })
})

module.exports=favoriteRouter; 
