const express = require('express')
const router  = express.Router()
const Item = require("../models/item")
const Purchase = require("../models/purchase")
const Weather = require("../models/weather")
const {ensureAuthenticated,ensureNotAuthenticated,ensureAdmin} = require('../config/auth') 

//Main page
router.get('/', ensureAuthenticated, ensureAdmin, async (req,res) => {

    try {

        const items = await Item.find()
        const purchases = await Purchase.find()
        const weather = await Weather.find()

        let info = {
            items: items,
            purchases: purchases,
            weather: weather,
            user: req.user,
            page: 'admin',
        }
    
        res.render('admin_body',{
            info: info,
            layout: '../views/layouts/index'
        })

    } catch(err) {
        console.log(err)
    }

})

module.exports = router