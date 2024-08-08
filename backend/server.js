const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
const port =3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'possys'
});
 
app.get('/', (req, res) => {
    return res.json("from backend side");
})

app.get('/product', (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

app.listen(3000, () => {
    console.log("listening");
})