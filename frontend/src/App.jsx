import React, { useState, useEffect } from 'react';
import './App.css';

function DataDisplay() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [notification, setNotification] = useState(''); // State for notification message

  // Function to handle buying products
  const handleBuy = async () => {
    try {
      const response = await fetch('http://localhost:3000/update-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      console.log('Purchase completed!');
      setCart([]);
      setNotification('Thank you for your purchase!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error updating stock:', error);
      setNotification('Failed to complete purchase. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/psm_product');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally set some state to display an error message to users
      }
    };

    fetchData();
  }, []);

  // Calculate the total price of the cart
  useEffect(() => {
    const calculateTotal = () => {
      setTotal(cart.reduce((acc, item) => acc + item.unit_price * item.quantity, 0));
    };

    calculateTotal();
  }, [cart]);

  // Add item to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.psm_product_ID === product.psm_product_ID);
      if (existingItem) {
        return prevCart.map((item) =>
          item.psm_product_ID === product.psm_product_ID ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from the cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.psm_product_ID !== productId));
  };

  return (
    <div>
      <div className="product-list">
        {products.map((psm_product) => (
          <div key={psm_product.psm_product_ID} className="product-container">
            <h2>{psm_product.product_name}</h2>
            <p>Desc: {psm_product.description}</p>
            <p>Stock: {psm_product.stock_level}</p>
            <p>Price: ${psm_product.unit_price.toFixed(2)}</p>
            <button onClick={() => addToCart(psm_product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Your Cart</h2>
        {cart.length > 0 ? (
          <div>
            {cart.map((item) => (
              <div key={item.psm_product_ID} className="cart-item">
                <p>{item.product_name} (x{item.quantity})</p>
                <p>
                  Price: ${item.unit_price.toFixed(2)} x {item.quantity} = $
                  {(item.unit_price * item.quantity).toFixed(2)}
                </p>
                <button onClick={() => removeFromCart(item.psm_product_ID)}>Remove</button>
              </div>
            ))}
            <p>Total: ${total.toFixed(2)}</p>
            <button onClick={handleBuy}>Buy Now</button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {notification && <div className="notification">{notification}</div>} {/* Display notification */}
    </div>
  );
}

export default DataDisplay;
