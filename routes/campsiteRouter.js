const express = require('express');
const campsiteRouter = express.Router();

// handle routing

campsiteRouter.route('/')
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // passes control to the next function
    next();
})
.get( (req, res) => {
    res.end('Will send all the camps to you');

})
.post( (req, res) => {
    res.end(`Will add the camps: ${req.body.name} with description: ${req.body.description}`);
})

.put( (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})

.delete( (req, res) => {
    res.end('Deleting all campsites');
});

// handles route for individual campsite

campsiteRouter.route('/:campsiteId')
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get( (req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
})
.post( (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put( (req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
    res.end(`Will update the campsite : ${req.body.name} with description: ${req.body.description}`)
})

.delete( (req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`);
});

module.exports=campsiteRouter