import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Cart({ cart = [], setCart }) {
  const [menuItems, setMenuItems] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tableNumber = params.get("table");

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300x200?text=Food";
    return `http://localhost:5000/uploads/${img}`;
  };

  useEffect(() => {
    fetch("http://localhost:5000/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
  };

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);

    if (existing) {
      const updated = cart.map((i) =>
        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let recommendations = [];

  cart.forEach((item) => {
    const cat = item.category.toLowerCase();

    if (cat === "fast food") {
      const drink = menuItems.find(
        (m) => m.category.toLowerCase() === "drinks"
      );

      if (
        drink &&
        !cart.find((c) => c._id === drink._id) &&
        !recommendations.find((r) => r._id === drink._id)
      ) {
        recommendations.unshift(drink);
      }

      menuItems.forEach((m) => {
        const mCat = m.category.toLowerCase();

        if (
          (mCat === "drinks" ||
            mCat === "side dish" ||
            mCat === "desi side dish") &&
          !cart.find((c) => c._id === m._id) &&
          !recommendations.find((r) => r._id === m._id)
        ) {
          recommendations.push(m);
        }
      });
    }

    if (cat === "desi") {
      menuItems.forEach((m) => {
        if (
          (m.category.toLowerCase() === "side dish" ||
            m.category.toLowerCase() === "desi side dish") &&
          !cart.find((c) => c._id === m._id) &&
          !recommendations.find((r) => r._id === m._id)
        ) {
          recommendations.push(m);
        }
      });
    }

    if (cat === "bbq") {
      menuItems.forEach((m) => {
        if (
          m.category.toLowerCase() === "drinks" &&
          !cart.find((c) => c._id === m._id) &&
          !recommendations.find((r) => r._id === m._id)
        ) {
          recommendations.push(m);
        }
      });
    }
  });

  recommendations = recommendations.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F5F0",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#1F2937", marginBottom: "10px" }}>🛒 Your Cart</h1>

      {tableNumber && (
        <h3 style={{ color: "#16A34A", marginBottom: "25px" }}>
          🍽 Table: {tableNumber}
        </h3>
      )}

      {cart.length === 0 && (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", color: "#6B7280" }}>Your cart is empty</p>
        </div>
      )}

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            gap: "18px",
            marginBottom: "18px",
            alignItems: "center",
            background: "white",
            padding: "16px",
            borderRadius: "20px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            flexWrap: "wrap",
          }}
        >
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />

          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: "20px", color: "#1F2937" }}>
              {item.name}
            </strong>
            <p style={{ margin: "8px 0 0", color: "#E67E22", fontWeight: "700" }}>
              Rs {item.price * item.quantity}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFF3E8",
              padding: "8px 12px",
              borderRadius: "999px",
            }}
          >
            <button
              onClick={() => decreaseQty(item._id)}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "none",
                background: "#E67E22",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              -
            </button>

            <span style={{ fontWeight: "700", color: "#1F2937" }}>
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQty(item._id)}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "none",
                background: "#E67E22",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item._id)}
            style={{
              background: "#EF4444",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {recommendations.length > 0 && (
        <div style={{ marginTop: "35px" }}>
          <h3 style={{ color: "#D35400", marginBottom: "18px" }}>
            ✨ Perfect Combo For Your Order
          </h3>

          {recommendations.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
                background: "#FFF8F1",
                border: "1px solid #F4C28B",
                padding: "16px",
                borderRadius: "18px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span style={{ color: "#1F2937", fontWeight: "600" }}>
                🤖 {item.name} (Rs {item.price})
              </span>

              <button
                onClick={() => addToCart(item)}
                style={{
                  background: "#E67E22",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <>
          <div
            style={{
              marginTop: "30px",
              background: "white",
              padding: "22px",
              borderRadius: "20px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ color: "#1F2937", margin: 0 }}>Total: Rs {total}</h2>
          </div>

          <Link to={`/checkout?table=${tableNumber}`}>
            <button
              style={{
                marginTop: "22px",
                width: "100%",
                padding: "16px 20px",
                background: "#16A34A",
                color: "white",
                border: "none",
                borderRadius: "18px",
                cursor: "pointer",
                fontSize: "17px",
                fontWeight: "700",
                boxShadow: "0 8px 18px rgba(22,163,74,0.25)",
              }}
            >
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;