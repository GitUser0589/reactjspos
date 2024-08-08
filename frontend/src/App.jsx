import React, { useState, useEffect } from 'react';
import './App.css';

function DataDisplay() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [receipt, setReceipt] = useState([]);
  const [purchaseTotal, setPurchaseTotal] = useState(0);

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
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const newTotal = cart.reduce((acc, item) => acc + item.UnitPrice * item.quantity, 0);
      setTotal(newTotal);
    };

    calculateTotal();
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      console.log('Previous Cart:', prevCart);  // Log the previous cart
      const existingItem = prevCart.find((item) => item.ProductID === product.ProductID);
      if (existingItem) {
        // Update quantity of existing item
        const updatedCart = prevCart.map((item) =>
          item.ProductID === product.ProductID ? { ...item, quantity: item.quantity + 1 } : item
        );
        console.log('Updated Cart with existing item:', updatedCart);  // Log the updated cart
        return updatedCart;
      } else {
        // Add new item to cart
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        console.log('Updated Cart with new item:', updatedCart);  // Log the updated cart
        return updatedCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.ProductID !== productId));
  };

  const handleBuy = () => {
    console.log('Purchase completed!');
    setReceipt(cart);
    setPurchaseTotal(total);
    setShowNotification(true);
    setCart([]);

    setTimeout(() => {
      setShowNotification(false);
      setReceipt([]);
    }, 5000);
  };

  return (
    <div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.ProductID} className="product-container">
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
              <div key={`${item.ProductID}-${item.quantity}`} className="cart-item">
                <p>{item.ProductName} (x{item.quantity})</p>
                <p>Price: ${item.UnitPrice.toFixed(2)} x {item.quantity} = ${(item.UnitPrice * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.ProductID)}>Remove</button>
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
              <li key={`${item.ProductID}-${item.quantity}`}>
                {item.ProductName} - ${item.UnitPrice.toFixed(2)} x {item.quantity} = ${(item.UnitPrice * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: ${purchaseTotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default DataDisplay;
