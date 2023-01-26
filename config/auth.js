module.exports = {

    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login')
    },
    
    ensureNotAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    },

    ensureAdmin: function(req,res,next) {

        let user = req.user

        if(user.role == 'admin') {
            return next()
        }
        res.redirect('/shopping')
    }
}