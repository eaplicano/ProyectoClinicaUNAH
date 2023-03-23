module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }
};  

// module.exports = {
//     isLoggedIn (req, res, next) {
//         if (req.user()) {
//             return next();
//         }
//         return res.redirect('/signin');
//     }
// };  