const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
const port =3000;

const db = mysql.createConnection({
    host: '172.27.16.112',
    user: 'root',
    password: '',
    database: 'sql'
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

app.post('/update-stock', (req, res) => {
    const { cart } = req.body;
  
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }
  
    // Start a transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Transaction error:', err);
        return res.status(500).json({ error: 'Transaction error' });
      }
  
      // Prepare and execute the SQL queries to update stock levels
      const queries = cart.map(item => {
        return {
          sql: 'UPDATE psm_product SET stock_level = stock_level - ? WHERE psm_product_ID = ?',
          values: [item.quantity, item.ProductID]
        };
      });
  
      let completedQueries = 0;
  
      queries.forEach((query, index) => {
        connection.query(query.sql, query.values, (err, results) => {
          if (err) {
            console.error(`Error updating stock for query ${index + 1}:`, err);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Failed to update stock' });
            });
          }
  
          completedQueries++;
  
          // If all queries are completed, commit the transaction
          if (completedQueries === queries.length) {
            connection.commit((err) => {
              if (err) {
                console.error('Commit error:', err);
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Failed to commit transaction' });
                });
              }
              res.status(200).json({ message: 'Stock updated successfully' });
            });
          }
        });
      });
    });
  });

app.listen(3000, () => {
    console.log("listening");
})