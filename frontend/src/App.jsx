import React, { useState, useEffect } from 'react';
import './App.css';

function DataDisplay() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
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

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.unit_price * item.quantity, 0);
  };

  const handleBuy = () => {
    console.log('Purchase completed!');
    setCart([]);
  };

  return (
    <div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-container">
            <h2>{product.product_name}</h2>
            <p>Desc: {product.description}</p>
            <p>Stock: {product.stock_level}</p>
            <p>Price: ${product.unit_price}</p>
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
                <p>{item.product_name} (x{item.quantity})</p>
                <p>Price: ${item.unit_price} x {item.quantity} = ${(item.unit_price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
            <p>Total: ${calculateTotal().toFixed(2)}</p>
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
