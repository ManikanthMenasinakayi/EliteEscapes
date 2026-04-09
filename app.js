
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express"); //to connect express
const app = express();


const path = require("path"); //for ejs setup
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

const ejsMate = require("ejs-mate");  //for ejs-mate
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname,"public"))); //to use static files in public folder

const ExpressError = require("./utils/ExpressError.js") //calling ExpressError.js

const session = require("express-session"); //to require express-session
const {MongoStore} = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport") //for Signup and login
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

app.use(express.urlencoded({extended:true})); //to parse the requested data

const methodoverride = require("method-override"); //method override
app.use(methodoverride("_method"));


const listingsRouter = require("./routes/listing.js"); //requiring listing.js
const reviewsRouter = require("./routes/review.js"); //requiring review.js
const userRouter = require("./routes/user.js")


const mongoose = require("mongoose"); //to connect mongoose
// const MONGO_URL = "mongodb://127.0.0.1:27017/EliteEscapes";
const dbUrl = process.env.ATLASDB_URL;

main() 
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SEESION STORE", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires after 1 week
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

//Root Route
// app.get("/", (req, res) => {
//     res.send("Hi iam root");
// });




app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

//middleware to handle server side error
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});


//for listening the localhost
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});