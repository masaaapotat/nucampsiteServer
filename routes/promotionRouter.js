const express = require('express');
const Promotion = require('../models/promotion');
const promotionRouter = express.Router();
const authenticate= require('../authenticate');

// Handle routing for /promotions
promotionRouter.route('/')
.get((req, res, next) => {
    // Fetch all promotion documents from the database
    Promotion.find()
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
    })
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    // Create a new promotion document from the request body
    Promotion.create(req.body)
    .then((promotion) => {
        console.log("Promotion Created ", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    })
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    // Delete all promotions
    Promotion.deleteMany({})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch((err) => next(err));
});

// Handles route for individual promotion
promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    })
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    })
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch((err) => next(err));
});

module.exports = promotionRouter;
