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
    Campsite.findByIdAndDelete(req.params.campsiteId) 
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Handle routing for individual comments under a specific campsite (/campsites/:campsiteId/comments/:commentId)

// Handle routing for the /:campsiteId/comments endpoint
campsiteRouter
  .route("/:campsiteId/comments")

  // GET request to retrieve all comments for a specific campsite
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) 
      .then((campsite) => {
        if (campsite) {
          // If campsite exists
          res.statusCode = 200; 
          res.setHeader("Content-Type", "application/json"); 
          res.json(campsite.comments); e
        } else {
          // If campsite not found
          const err = new Error(`Campsite ${req.params.campsiteId} not found`); 
          err.status = 404; 
          return next(err); 
        }
      })
      .catch((err) => next(err));
  })

  // POST request to add a new comment to a specific campsite
  .post((req, res, next) => {
    Campsite.findById(req.params.campsiteId) 
      .then((campsite) => {
        if (campsite) {
          // If campsite exists
          campsite.comments.push(req.body); 
          campsite
             // Save the updated campsite document
            .save()
            .then((campsite) => {
              res.statusCode = 200; 
              res.setHeader("Content-Type", "application/json"); 
              res.json(campsite); 
            })
            .catch((err) => next(err)); 
        } else {
          // If campsite not found
          const err = new Error(`Campsite ${req.params.campsiteId} not found`); 
          err.status = 404; 
          return next(err); 
        }
      })
      .catch((err) => next(err)); 
  })

  // PUT request is not supported on /comments
  .put((req, res) => {
    res.statusCode = 403; 
    res.end(
      `PUT operation not supported on /campsites/${req.params.campsiteId}/comments`
    ); 
  })

  // DELETE request to remove all comments for a specific campsite
  .delete((req, res, next) => {
    Campsite.findById(req.params.campsiteId) 
      .then((campsite) => {
        if (campsite) {
        
          for (let i = campsite.comments.length - 1; i >= 0; i--) {
            campsite.comments.id(campsite.comments[i]._id).deleteOne(); 
          }
          campsite
            .save() 
            .then((campsite) => {
              res.statusCode = 200; 
              res.setHeader("Content-Type", "application/json"); 
              res.json(campsite); 
            })
            .catch((err) => next(err)); errors
        } else {
          // If campsite not found
          const err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404; 
          return next(err); 
        }
      })
      .catch((err) => next(err));
  });

// Handle routing for individual comments under a specific campsite (/campsites/:campsiteId/comments/:commentId)
campsiteRouter
  .route("/:campsiteId/comments/:commentId")

  // GET request to retrieve a specific comment by ID
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) // Find campsite by ID
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          // If campsite and comment exist
          res.statusCode = 200; 
          res.setHeader("Content-Type", "application/json"); 
          res.json(campsite.comments.id(req.params.commentId)); 
        } else if (!campsite) {
          // If campsite not found
          const err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404; 
          return next(err);
        } else {
          // If comment not found
          const err = new Error(`Comment ${req.params.commentId} not found`); 
          err.status = 404;
          return next(err); 
        }
      })
      .catch((err) => next(err));
  })

  // POST request is not supported on a specific comment
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
    ); 
  })

  // PUT request to update a specific comment by ID
  .put((req, res, next) => {
    Campsite.findById(req.params.campsiteId) 
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          // If campsite and comment exist
          if (req.body.rating) {
            // Update comment rating 
            campsite.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.text) {
            campsite.comments.id(req.params.commentId).text = req.body.text; // Update comment text
          }
          campsite
            .save() 
            .then((campsite) => {
              res.statusCode = 200; 
              res.setHeader("Content-Type", "application/json"); 
              res.json(campsite); 
            })
            .catch((err) => next(err)); 
        } else if (!campsite) {
          // If campsite not found
          const err = new Error(`Campsite ${req.params.campsiteId} not found`); 
          err.status = 404; 
          return next(err); 
        } else {
          // If comment not found
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404; 
          return next(err); 
        }
      })
      .catch((err) => next(err));
  })

  // DELETE request to delete a specific comment by ID
  .delete((req, res, next) => {
    Campsite.findById(req.params.campsiteId) 
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          // If campsite and comment exist
          campsite.comments.id(req.params.commentId).deleteOne(); // Delete the comment
          campsite
            .save() // Save the updated campsite document without the deleted comment
            .then((campsite) => {
              res.statusCode = 200; 
              res.setHeader("Content-Type", "application/json"); 
              res.json(campsite);
            })
            .catch((err) => next(err)); 
        } else if (!campsite) {
          // If campsite not found
          const err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404; 
          return next(err); 
        } else {
          // If comment not found
          const err = new Error(`Comment ${req.params.commentId} not found`); 
          err.status = 404; 
          return next(err); 
        }
      })
      .catch((err) => next(err)); 
  });

module.exports = campsiteRouter; 