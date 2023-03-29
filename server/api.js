const express = require('express');
const { fetchPrices } = require('./scraper')
const router = express.Router();

router.get('/:name', (req, res) => {
    //return ticket prices of movie with name ":name"
    fetchPrices(req.params.name).then((movies) => {
        res.set('Access-Control-Allow-Origin', '*')
        res.send(movies)
})
    
    
})

module.exports = router