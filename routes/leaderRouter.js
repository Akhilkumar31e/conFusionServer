const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
const mongoose =require('mongoose');
const Leaders = require('../models/leaders');

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then(( leaders ) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.put((req,res,next) => {
    res.statusCode=403;
    res.end('PUT operation is not supported on /leaders');
})
.post((req,res,next) => {
    Leaders.create(req.body)
    .then(( leader ) => {
        console.log('Leader is created ',leader);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=> next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Leaders.remove({})
    .then((response) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    },(err) => next(err))
    .catch((err) => next(err));
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.find({abbr:req.params.leaderId})
    .then( (leader) =>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.post((req,res,next) => {
    res.statusCode=403;
    res.end('Post operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.delete( (req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((response) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }, (err)=> next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter;