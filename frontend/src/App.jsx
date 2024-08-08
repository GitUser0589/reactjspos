import React, { useState, useEffect } from 'react';
import './App.css';

function DataDisplay() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [receipt, setReceipt] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/product'); // Replace with your actual API URL
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

  useEffect(() => {
    const calculateTotal = () => {
      setTotal(cart.reduce((acc, item) => acc + item.UnitPrice * item.quantity, 0));
    };

    calculateTotal();
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleBuy = () => {
    console.log('Purchase completed!');
    setReceipt(cart);  // Save the cart items as a receipt
    setShowNotification(true);  // Show the purchase complete notification
    setCart([]);  // Clear the cart after purchase

    // Hide the notification after a few seconds
    setTimeout(() => {
      setShowNotification(false);
      setReceipt([]);  // Clear the receipt after displaying
    }, 5000); // Adjust the time as needed
  };

  return (
    <div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-container">
            <h2>{product.ProductName}</h2>
            <p>Desc: {product.Description}</p>
            <p>Stock: {product.StockLevel}</p>
            <p>Price: ${product.UnitPrice.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Your Cart</h2>
        {cart.length > 0 ? (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <p>{item.ProductName} (x{item.quantity})</p>
                <p>Price: ${item.UnitPrice.toFixed(2)} x {item.quantity} = ${(item.UnitPrice * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
            <p>Total: ${total.toFixed(2)}</p>
            <button onClick={handleBuy}>Buy Now</button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {showNotification && (
        <div className="notification">
          <h3>Purchase Complete!</h3>
          <p>Thank you for your purchase. Here is your receipt:</p>
          <ul>
            {receipt.map((item) => (
              <li key={item.id}>
                {item.ProductName} - ${item.UnitPrice.toFixed(2)} x {item.quantity} = ${(item.UnitPrice * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default DataDisplay;
