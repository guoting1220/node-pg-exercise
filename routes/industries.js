
const express = require("express");
const expressError = require("../expressError");
const db = require("../db")
const router = express.Router();


router.get('/', async (req, res, next) => {
    try {
        const industriesResults = await db.query(
            `SELECT * FROM industries`
        );

        for (indResult of industriesResults.rows) {
            const companyResults = await db.query(
                `SELECT * 
                FROM company_industry 
                WHERE ind_code = $1`,
                [indResult.code]
            )
            
            indResult.companies = companyResults.rows.map(r => r.comp_code);
        }

        return res.json({ industries: industriesResults.rows });
    }
    catch (e) {
        return next(e);
    }
})


router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;

        const industryResult = await db.query(
            `SELECT * FROM industries WHERE code = $1`, [code]);

        if (industryResult.rows.length === 0) {
            throw new expressError(`can not find industry with code of ${code}`, 404);
        }

        return res.json({ industry: industryResult.rows[0]});        
    }
    catch (e) {
        return next(e);
    }
})


router.post('/', async (req, res, next) => {
    try {
        const { code, industry } = req.body;
       
        const results = await db.query(
            `INSERT INTO industries
            VALUES ($1, $2) 
            RETURNING code, industry`,
            [code, industry]
        );

        return res.json({ company: results.rows[0] });
    }
    catch (e) {
        return next(e);
    }
})


router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;

        const results = await db.query(
            `DELETE FROM industries             
            WHERE code = $1
            RETURNING code`,
            [code]
        );

        if (results.rows.length === 0) {
            throw new expressError(`can not find industry with code of ${code}`, 404);
        }
        return res.json({ status: "deleted" });
    }
    catch (e) {
        return next(e);
    }
})


router.post('/ind_comp', async (req, res, next) => {
    try {
        const {ind_code, comp_code} = req.body;

        const industryResult = await db.query(
            `SELECT * 
            FROM industries
            WHERE code = $1`,
            [ind_code]
        )

        if (industryResult.rows.length === 0) {
            throw new expressError(`can not find industry with code of ${ind_code}`, 404);
        }

        const companyResult = await db.query(
            `SELECT * 
            FROM companies
            WHERE code = $1`,
            [comp_code]
        )

        if (companyResult.rows.length === 0) {
            throw new expressError(`can not find company with code of ${comp_code}`, 404);
        }

        const results = await db.query(
            `INSERT INTO company_industry(comp_code, ind_code)
            VALUES ($1, $2)
            RETURNING comp_code, ind_code`,
            [comp_code, ind_code]
        )

        return res.json({ company_industry: results.rows[0]});
    }
    catch(e) {
        return next(e);
    }
})


module.exports = router;