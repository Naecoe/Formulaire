module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Vous devez être connecté pour voir ceci');
        res.redirect('/users/login');
    }
}