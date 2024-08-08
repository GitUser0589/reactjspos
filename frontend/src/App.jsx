import React, { useState, useEffect } from 'react';
import './App.css';

function DataDisplay() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('t');
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
      setTotal(cart.reduce((acc, item) => acc + item.unit_price * item.quantity, 0));
    };

    calculateTotal();
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === psm_product.psm_product_ID);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === psm_product.psm_product_ID ? { ...item, quantity: item.quantity + 1 } : item
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
    setCart([]);
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
              <div key={item.id} className="cart-item">
                <p>{item.product_name} (x{item.quantity})</p>
                <p>Price: ${item.unit_price.toFixed(2)} x {item.quantity} = ${(item.unit_price * item.quantity).toFixed(2)}</p>
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
    </div>
  );
}

export default DataDisplay;
