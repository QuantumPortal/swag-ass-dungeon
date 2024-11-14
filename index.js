const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));



app.get("/", function (request, response) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");

    // just send the text stream
    response.send(doc);
});

app.get("/layouts", function(request, response) {
    let desiredLayout = request.query["name"];

    response.setHeader("Content-Type", "application/json");
    response.send(fs.readFileSync(`./app/data/layouts/${desiredLayout}.html`, "utf8"));
});

app.get("/enemies", function(request, response) {
    let desiredEnemy = request.query["enemy"];

    response.setHeader("Content-Type", "application/json");
    response.send(fs.readFileSync(`./app/data/enemies/${desiredEnemy}.json`, "utf8"));
});

app.get("/attacks", function(request, response) {
    let desiredAttack = request.query["type"];

    response.setHeader("Content-Type", "application/json");
    response.send(fs.readFileSync(`./app/data/attacks/${desiredAttack}.json`, "utf8"));
});


// for page not found (i.e., 404)
app.use(function (request, response, next) {
    // this could be a separate file too - but you'd have to make sure that you have the path
    // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
    response.status(404).send("<html><head><title>Page not found!</title></head><body><p>Sir, there's nothing here to see!</p></body></html>");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});

/*
app.get("/markers", function (request, response) {

    let doc = fs.readFileSync("./app/data/google-map-markers.js", "utf8");
    response.setHeader("Content-Type", "application/json");
    // just send the text stream
    response.send(doc);
});

app.get("/enemies", function (request, response) {

    let enemyType = request.query["type"];

    if (fs.existsSync(`./app/data/enemies/${enemyType}.html`)) {
        response.setHeader("Content-Type", "application/json");
        response.send(fs.readFileSync(`./app/data/enemies/${enemyType}.html`, "utf8"));
    } else {
        response.send({ status: "fail", msg: "Does Not Exist!" });
    }



    
});

/*
 * This one accepts a query string
 */


