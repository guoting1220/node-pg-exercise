
const express = require("express");
const expressError = require("../expressError");
const db = require("../db")
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT * FROM companies`
        );
        return res.json({companies: results.rows});
    } 
    catch(e) {
        return next(e);
    }    
})


router.get('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;

        const results = await db.query(
            `SELECT * FROM companies WHERE code = $1`, [code]);

        if (results.rows.length === 0) {
            throw new expressError(`can not find company with code of ${code}`, 404);
        }

        const data = results.rows[0];

        const invoices = await db.query(
           `SELECT id 
            FROM invoices
            WHERE comp_code = $1`,
            [code]
        )

    
        const company = {
            code: data.code,
            name: data.name,
            description: data.description,
            invoices: invoices.rows.map(r => r.id)
        }

        return res.json({ company: company });
    } 
    catch (e) {
        return next(e);
    }
})


router.post('/', async (req, res, next) => {
    try {      
        const {code, name, description} = req.body;  

        const results = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) 
            RETURNING code, name, description`, 
            [code, name, description]
        );   

        return res.json({ company: results.rows[0] });
    } 
    catch (e) {
        return next(e);
    }
})


router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body; 

        const results = await db.query(
            `UPDATE companies 
            SET name = $1, description = $2
            WHERE code = $3
            RETURNING code, name, description`,
            [name, description, code]
        );

        if (results.rows.length === 0) {
            throw new expressError(`can not find company with code of ${code}`, 404);
        }
        return res.json({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    }
})


router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;

        const results = await db.query(
            `DELETE FROM companies             
            WHERE code = $1
            RETURNING code`,
            [code]
        );

        if (results.rows.length === 0) {
            throw new expressError(`can not find company with code of ${code}`, 404);
        }
        return res.json({ status: "deleted" });
    } 
    catch (e) {
        return next(e);
    }
})


module.exports = router;