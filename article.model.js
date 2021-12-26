const mongoose = require("mongoose");

const ArcticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
});

const Article = mongoose.model("Article", ArcticleSchema);
module.exports = Article;
