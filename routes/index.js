const express = require('express')
const router  = express.Router()
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth') 

//Main page
router.get('/', ensureAuthenticated, (req,res) => {
    res.redirect('/shopping')
})

module.exports = router