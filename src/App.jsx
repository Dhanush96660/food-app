import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [recipe, setRecipe] = useState([]);
  const [cart, setCart] = useState([]);
  const [show, setShow] = useState(false);

  async function GetData() {
    const data = await fetch("https://dummyjson.com/recipes");
    const response = await data.json();
    setRecipe(response.recipes);
  }

  useEffect(() => { GetData(); }, []);

  function AddCart(product) {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      toast.error(`${product.name} is already in the cart`);
    } else {
      setCart([...cart, product]);
      toast.success(`${product.name} added to the cart`);
    }
  }

  function RemoveCart(id) {
    setCart(cart.filter(item => item.id !== id));
    toast.info("Item removed from cart");
  }

  return (
    <div className="app-container">
      <ToastContainer autoClose={2000} theme="colored" />
      
      {/* Header */}
      <header className="header">
        <h1>🍽️ Recipe Store</h1>
        <button className="cart-btn" onClick={() => setShow(true)}>
          🛒 Cart <span>{cart.length}</span>
        </button>
      </header>

      {/* Recipes Grid */}
      <div className="recipes">
        {recipe.map((item) => (
          <div key={item.id} className="recipe-card">
            <img src={item.image} alt={item.name} className="recipe-img" />
            <div className="recipe-info">
              <h2>{item.name}</h2>
              <p><strong>⏱️ Prep Time:</strong> {item.prepTimeMinutes} mins</p>
              <p className="ingredients">
                <strong>🥗 Ingredients:</strong> {item.ingredients.slice(0, 5).join(", ")}...
              </p>
              <button className="add-btn" onClick={() => AddCart(item)}>➕ Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🛒 Your Cart</h2>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Ingredients: {item.ingredients.slice(0, 3).join(", ")}...</p>
                  </div>
                  <button className="remove-btn" onClick={() => RemoveCart(item.id)}>❌</button>
                </div>
              ))
            ) : (
              <p>🛒 Your cart is empty</p>
            )}
            <button className="close-btn" onClick={() => setShow(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
