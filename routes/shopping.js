const express = require('express')
const router  = express.Router()
const Item = require("../models/item")
const Purchase = require("../models/purchase")
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth') 

//Main page
router.get('/', ensureAuthenticated, async (req,res) => {

    try {
        
        const items = await Item.find({availability: true})
        const userPurchases = await Purchase.find({user:req.user._id})

        let info = {
            user: req.user,
            purchases: userPurchases,
            items: items,
            page: 'shopping',
        }

        res.render('shopping_body',{
            info: info,
            layout: '../views/layouts/index'
        })

    } catch (err) {
        console.log(err)
    }
    
})

module.exports = router

//Alvin
