const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
//Including mongoose
const mongoose = require('mongoose');
//require schema for promotions
const Promotions = require('../models/promotions');

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then(( promotions ) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.put((req,res,next) => {
    res.statusCode=403;
    res.end('PUT operation is not supported on /promos');
})
.post((req,res,next) => {
    Promotions.create(req.body)
    .then(( promotion ) => {
        console.log('Promotion is created ',promotion);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=> next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Promotions.remove({})
    .then((response) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    },(err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then( (promotion) =>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.post((req,res,next) => {
    res.statusCode=403;
    res.end('Post operation not supported on /promotions/'+ req.params.promoId);
})
.put((req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})
    .then((promotion) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.delete( (req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((response) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }, (err)=> next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;