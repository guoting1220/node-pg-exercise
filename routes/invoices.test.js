process.env.NODE_ENV = 'test';
const request = require("supertest");
const db = require("../db");
const app = require("../app");
const { createData } = require("./_test-common");

beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /invoices", () => {
    test("Get a list with all invoices", async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            {
                invoices: [
                    { id: 1, comp_code: "apple" },
                    { id: 2, comp_code: "apple" },
                    { id: 3, comp_code: "ibm" },
                ]
            }
        )
    })
})


describe("GET /1", () => {

    test("It return invoice info", async () => {
        const res = await request(app).get("/invoices/1");
        expect(res.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    amt: 100,
                    add_date: '2018-01-01T08:00:00.000Z',
                    paid: false,
                    paid_date: null,
                    company: {
                        code: 'apple',
                        name: 'Apple',
                        description: 'Maker of OSX.',
                    }
                }
            }
        );
    });

    test("It should return 404 for no-such-invoice", async () => {
        const res = await request(app).get("/invoices/999");
        expect(res.status).toEqual(404);
    })
});


describe("POST /", () => {

    test("It should add invoice", async () => {
        const res = await request(app)
            .post("/invoices")
            .send({ amt: 400, comp_code: 'ibm' });

        expect(res.body).toEqual(
            {
                "invoice": {
                    id: 4,
                    comp_code: "ibm",
                    amt: 400,
                    add_date: expect.any(String),
                    paid: false,
                    paid_date: null,
                }
            }
        );
    });
});


describe("PUT /", () => {

    test("It should update an invoice", async () => {
        const res = await request(app)
            .put("/invoices/1")
            .send({ amt: 1000, paid: false });

        expect(res.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    comp_code: 'apple',
                    paid: false,
                    amt: 1000,
                    add_date: expect.any(String),
                    paid_date: null,
                }
            }
        );
    });

    test("It should return 404 for no-such-invoice", async () => {
        const res = await request(app)
            .put("/invoices/9999")
            .send({ amt: 1000 });

        expect(res.status).toEqual(404);
    });

    test("It should return 500 for missing data", async () => {
        const res = await request(app)
            .put("/invoices/1")
            .send({});

        expect(res.status).toEqual(500);
    })
});


describe("DELETE /", () => {

    test("It should delete invoice", async () => {
        const res = await request(app)
            .delete("/invoices/1");

        expect(res.body).toEqual({ "status": "deleted" });
    });

    test("It should return 404 for no-such-invoices", async () => {
        const res = await request(app)
            .delete("/invoices/999");

        expect(res.status).toEqual(404);
    });
});

