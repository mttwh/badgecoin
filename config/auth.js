/*
exported function to work with the Passport authentication
function checks if user is authenticated using the Passport ID in the request
if user is not authenticated, they will be redirected to the login page
this function can be included in routes to ensure a user is logged in
*/
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/users/login");
  }
};
