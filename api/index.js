const express = require('express')
const router  = express.Router()
const Item = require("../models/item")
const Purchase = require("../models/purchase")
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth')

//Main page
router.get('/',ensureAuthenticated, (req,res) => {
    res.redirect('/shopping')
})

//Checkout API
router.post('/checkout',ensureAuthenticated, async (req,res) => {

    let user = req.user
    let cart = req.body.cart
    let checkout = []

    try {

        await Promise.all(cart.map(async (order) => {
            
            let item = await Item.findById(order.item)

            let cartItem = {
                itemCount: order.itemCount,
                item: item
            }
            checkout.push(cartItem)
        }))

        const purchase = new Purchase({
            user: user,
            checkout: checkout
        })

        await purchase.save()
        
        let queue = await Purchase.find({status:'in progress'})
        
        req.app.locals.mqttClient.publish('packaging/queue', JSON.stringify(queue), 
        { 
            qos: 0, 
            retain: true
        })
        
        let response = {
            purchase: purchase,
            status: 'ok'
        }

        res.json(response)

    } catch (err) {
        console.log(err)
        res.json({status:'fail',err:err})
    }
    
})

//Add to Favourite
router.post('/add_to_fav',ensureAuthenticated, async (req,res) => {
    
    let user = req.user
    let itemId = req.body.itemId

    try {

        let item = await Item.findById(itemId)

        item.favouriteCount++
        user.favouriteItem.push(item)

        await item.save()
        await user.save()

        let response = {
            item: item,
            status: 'ok'
        }

        res.json(response)

    } catch (err) {
        console.log(err)
        res.json({status:'fail',err:err})
    }

})

//Remove from Favourite
router.post('/remove_from_fav',ensureAuthenticated, async (req,res) => {
    
    let user = req.user
    let itemId = req.body.itemId

    try {

        let item = await Item.findById(itemId)

        item.favouriteCount--
        let favArray = user.favouriteItem

        let removedItemArray = favArray.filter((e) => {
            e._id != itemId
        })

        user.favouriteItem = removedItemArray

        await item.save()
        await user.save()

        let response = {
            item: item,
            status: 'ok'
        }

        res.json(response)

    } catch (err) {
        console.log(err)
        res.json({status:'fail',err:err})
    }

})

module.exports = router