const express = require('express')
const router  = express.Router()
const Item = require("../models/item")
const {ensureAuthenticated,ensureNotAuthenticated,ensureAdmin} = require('../config/auth') 

//Main page
router.get('/new', ensureAuthenticated, ensureAdmin, (req,res) => {

    let info = {
        user: req.user,
        item: {},
        page: 'new',
    }

    res.render('item_body',{
        info: info,
        layout: '../views/layouts/index'
    })
})

//Adding new item
router.post('/new',ensureAuthenticated, ensureAdmin, async (req,res) => {
    
    const item = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stockCount: req.body.stock,
        thumbnail: req.body.thumbnail,
        favouriteCount: 0
    }

    let errors = []

    if (!item.name || !item.description || !item.price || !item.thumbnail) {
        errors.push({msg:'Please fill in all the fields'})
    }

    if(errors.length > 0 ) {

        let info = {
            status: false,
            user: req.user,
            errors: errors,
            item: item,
            page: 'new',
        }

        return res.render('item_body', {
            info: info,
            layout: '../views/layouts/index'
        })
    }

    try {

        let itemRes = await Item.findOne({name: item.name})
        
        if (itemRes) {
            errors.push({msg: 'Item already existed'})

            let info = {
                status: false,
                user: req.user,
                errors: errors,
                item: item,
                page: 'new',
            }
            return res.render('item_body', {
                info: info,
                layout: '../views/layouts/index'
            })
        } else {

            const newItem = new Item(item)
            await newItem.save()

            console.log('New Item Saved')

            return res.redirect('/admin')

        }

    } catch(err) {
        console.log(err)
        errors.push(err)

        let info = {
            status: false,
            user: req.user,
            errors: errors,
            item: item,
            page: 'new',
        }
        return res.render('item_body', {
            info: info,
            layout: '../views/layouts/index'
        })
    }

})

module.exports = router