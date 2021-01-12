process.env.NODE_ENV = 'test';
const request = require("supertest");
const db = require("../db");
const app = require("../app");
const { createData } = require("./_test-common");

beforeEach(createData);

afterAll(async () => {
    await db.end()
})


describe("GET /", () => {
    test("Get a list with all companies", async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            { companies: [
                {code:"apple", name:"Apple"},
                {code: "ibm", name: "IBM"}] 
            }
        )
    })
})


describe("GET /apple", () => {
    test("It returns a single company info", async () => {
        const res = await request(app).get("/companies/apple");
        expect(res.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple",
                    description: "Maker of OSX.",
                    invoices: [1, 2]
                }
            }
        );
    });

    test("It should return 404 for no-such-company", async () => {
        const res = await request(app).get("/companies/blargh");
        expect(res.status).toEqual(404);
    })
});


describe("POST /", () => {
    test("It should add company", async () => {
        const res = await request(app)
            .post("/companies")
            .send({ code: "tacotime", name: "TacoTime", description: "Yum!" });

        expect(res.body).toEqual(
            {
                "company": {
                    code: "tacotime",
                    name: "TacoTime",
                    description: "Yum!",
                }
            }
        );
    });

    test("It should return 500 for conflict", async () => {
        const res = await request(app)
            .post("/companies")
            .send({ code: "apple", name: "Apple", description: "Huh?" });

        expect(res.status).toEqual(500);
    })
});


describe("PUT /", () => {
    test("It should update company", async () => {
        const res = await request(app)
            .put("/companies/apple")
            .send({ name: "AppleEdit", description: "NewDescrip" });

        expect(res.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "AppleEdit",
                    description: "NewDescrip",
                }
            }
        );
    });

    test("It should return 404 for no-such-comp", async () => {
        const res = await request(app)
            .put("/companies/blargh")
            .send({ name: "Blargh" });

        expect(res.status).toEqual(404);
    });

    test("It should return 500 for missing data", async () => {
        const res = await request(app)
            .put("/companies/apple")
            .send({});

        expect(res.status).toEqual(500);
    })
});


describe("DELETE /", () => {
    test("It should delete company", async () => {
        const res = await request(app)
            .delete("/companies/apple");

        expect(res.body).toEqual({ "status": "deleted" });
    });

    test("It should return 404 for no-such-comp", async function () {
        const res = await request(app)
            .delete("/companies/blargh");

        expect(res.status).toEqual(404);
    });
});

