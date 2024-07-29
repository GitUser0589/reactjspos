const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
const port =3000;

const db = mysql.createConnection({
    host: 'sql313.infinityfree.com',
    user: 'if0_36978277',
    password: 'OozB0bU1MPnubI',
    database: 'if0_36978277_ERM_DB'
});

app.get('/', (req, res) => {
    return res.json("from backend side");
})

app.get('/psm_product', (req, res) => {
    const sql = "SELECT * FROM psm_product";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

app.listen(3000, () => {
    console.log("listening");
})