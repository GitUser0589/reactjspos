const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const port = 3000;

// Configure MySQL connection
const db = mysql.createConnection({
  host: '192.168.1.8',
  user: 'sia',
  password: 'sia123',
  database: 'sql'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Route to update stock with transactions
app.post('/update-stock', (req, res) => {
  const cart = req.body.items; // Expecting an array of { psm_product_ID, quantity }

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid cart data' });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Prepare and execute the SQL queries to update stock levels
    const queries = cart.map(item => {
      return {
        sql: 'UPDATE psm_product SET stock_level = stock_level - ? WHERE psm_product_ID = ?',
        values: [item.quantity, item.psm_product_ID]
      };
    });

    let completedQueries = 0;

    queries.forEach((query, index) => {
      db.query(query.sql, query.values, (err, results) => {
        if (err) {
          console.error(`Error updating stock for query ${index + 1}:`, err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to update stock' });
          });
        }

        completedQueries++;

        // If all queries are completed, commit the transaction
        if (completedQueries === queries.length) {
          db.commit((err) => {
            if (err) {
              console.error('Commit error:', err);
              return db.rollback(() => {
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

// Route to get products
app.get('/psm_product', (req, res) => {
  const sql = "SELECT * FROM psm_product";
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.json(result);
    }
  });
});

// Test route
app.get('/', (req, res) => {
  res.json("from backend side");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
