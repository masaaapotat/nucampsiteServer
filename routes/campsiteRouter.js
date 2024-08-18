const express = require("express");
const Campsite = require("../models/campsite");
const campsiteRouter = express.Router();

// Handle routing for the /campsites endpoint
campsiteRouter
  .route("/")

  // GET request to fetch all campsites
  .get((req, res, next) => {
    // Fetch all campsite documents from the database
    Campsite.find() 
      .then((campsites) => {
        res.statusCode = 200; 
        res.setHeader("Content-Type", "application/json"); 
        res.json(campsites); 
      })
      .catch((err) => next(err)); 
  })

  // POST request to create a new campsite
  .post((req, res, next) => {
    // Create a new campsite document from the request body
    Campsite.create(req.body) 
      .then((campsite) => {
        console.log("Campsite Created ", campsite); 
        res.statusCode = 200; 
        res.setHeader("Content-Type", "application/json"); 
        res.json(campsite); 
      })
      .catch((err) => next(err)); 
  })

  // PUT request is not allowed on /campsites
  .put((req, res) => {
    res.statusCode = 403; 
    res.end("PUT operation not supported on /campsites"); 
  })

  // DELETE request to delete all campsites
  .delete((req, res, next) => {
    Campsite.deleteMany() 
      .then((response) => {
        res.statusCode = 200; 
        res.setHeader("Content-Type", "application/json"); 
        res.json(response); 
      })
      .catch((err) => next(err));
  });

// Handle routing for individual campsite based on ID (/campsites/:campsiteId)
campsiteRouter
  .route("/:campsiteId")

  // GET request to fetch a campsite by ID
  .get((req, res, next) => {
    // Find the campsite document by ID
    Campsite.findById(req.params.campsiteId) 
      .then((campsite) => {
        res.statusCode = 200; 
        res.setHeader("Content-Type", "application/json"); 
        res.json(campsite); 
      })
      .catch((err) => next(err));
  })

  // POST request is not allowed on /campsites/:campsiteId
  .post((req, res) => {
    res.statusCode = 403; 
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}`
    ); 
  })

  // PUT request to update a campsite by ID
  .put((req, res, next) => {
    Campsite.findByIdAndUpdate(
      req.params.campsiteId, // Find campsite by ID
      {
        $set: req.body, // Update the campsite fields with the request body
      },
      // Return the updated document
      { new: true } 
    )
      .then((campsite) => {
        res.statusCode = 200; 
        res.setHeader("Content-Type", "application/json");
        res.json(campsite); 
      })
      .catch((err) => next(err)); 
  })

  // DELETE request to delete a campsite by ID
  .delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId) // Delete campsite by ID
      .then((response) => {
        res.statusCode = 200; 
        res.setHeader("Content-Type", "application/json"); 
        res.json(response); 
      })
      .catch((err) => next(err)); 
  });

module.exports = campsiteRouter;
