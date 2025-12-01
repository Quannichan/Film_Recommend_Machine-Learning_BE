const auth = require("./routes/auth")
const public = require("./routes/public");
const info  = require("./routes/info");
const postsample  = require("./routes/postSample");
const admin = require("./routes/admin");
const mw = require("../middleware/middelware");
const ROOT_URL = "/api/be"

function route(app){

    //public
    app.use(mw.checkRole([]));

    app.use(ROOT_URL + "/", public);

    app.use(ROOT_URL + "/account", auth);

    //all role login already
    app.use(mw.checkRole(["SUPADM", "NORM"]));

    app.use(ROOT_URL + "/accSetting", info);

    app.use(ROOT_URL + "/postsample", postsample);

    //admin
    app.use(mw.checkRole(["SUPADM"]));
    
    app.use(ROOT_URL + "/admin", admin);
}

module.exports.Route = route
