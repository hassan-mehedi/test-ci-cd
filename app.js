const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const Article = require("./article.model.js");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();
const server = http.Server(app);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", () => {
    console.log("Server running");
});

mongoose.Promise = global.Promise;
let dbURL =
    "mongodb://localhost:27017/" +
    (process.env.NODE_ENV === "test" ? "testDB" : "realDB");
dbURL = process.env.NODE_ENV === "prod" ? process.env.db : dbURL;

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", (err) => {
    console.log(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
    try {
        response.status(200).json("Hello world");
    } catch (err) {
        console.log(err);
    }
});

app.post("/article/new", async (request, response) => {
    const newArticle = new Article(request.body);
    newArticle.save((err, article) => {
        if (err) {
            return response
                .status(400)
                .json({ error: "Could not save article" });
        }
        response.status(200).json({ message: "Article saved successfully" });
    });
});

app.get("/article/list", async (request, response) => {
    try {
        const article = await Article.find({});
        response.status(200).json(article);
    } catch (err) {
        console.log(err);
    }
});

app.get("/article/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const article = await Article.findById({ _id: id });

        if (!article) {
            response.status(400).json({ error: "Article not found" });
        } else {
            response.status(200).json(article);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    app,
    server,
    mongoose,
};
