global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { app, server, mongoose } = require("./../app");
const Article = require("./../article.model.js");
const request = require("supertest");

describe("When the article CRUD server is running", () => {
    afterAll(async () => {
        await server.close();
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should return 200 response if POST request receives proper article data", async () => {
        const res = await request(app)
            .post("/article/new")
            .send({ title: "article2", content: "It is Mahin's article" });

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
    });

    it("Should return 400 response if POST request data is missing the article title", async () => {
        const res = await request(app)
            .post("/article/new")
            .send({ content: "test" });

        expect(res.status).toBe(400);
        expect(typeof res.body).toEqual("object");
    });

    it("Should return 200 response if GET request receives proper article data", async () => {
        const res = await request(app).get("/article/list");
        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
    });

    it("Should return 200 response if GET request receives proper article by providing id", async () => {
        const articles = await request(app).get("/article/list");
        const id = articles.body[0]._id;

        const res = await request(app).get(`/article/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toEqual("article2");
    });

    it("Should return 400 response if GET request by id fails", async () => {
        const res = await request(app).get(`/article/61c847baa8632455e9028212`);

        expect(res.status).toBe(400);
    });
});
