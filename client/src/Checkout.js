import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Checkout({ cart = [] }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tableNumber = params.get("table");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    if (!name || !phone) {
      alert("Please fill all fields");
      return;
    }

    const order = {
      customerName: name,
      phone: phone,
      tableNumber: tableNumber,
      items: cart,
      total: total,
      status: "Pending",
    };

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      alert("✅ Order Placed Successfully!");
      window.location.href = `/track/${data._id}`;
    } catch (error) {
      console.error(error);
      alert("❌ Error placing order");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F5F0",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#1F2937", marginBottom: "10px" }}>🧾 Checkout</h1>

      {tableNumber ? (
        <h3 style={{ color: "#16A34A", marginBottom: "25px" }}>
          🍽 Table: {tableNumber}
        </h3>
      ) : (
        <h3 style={{ color: "#DC2626", marginBottom: "25px" }}>
          Please scan the table QR code
        </h3>
      )}

      {/* Customer Info */}
      <div
        style={{
          maxWidth: "500px",
          marginBottom: "30px",
          background: "white",
          padding: "24px",
          borderRadius: "22px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#1F2937", marginTop: 0 }}>Customer Details</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginBottom: "14px",
            borderRadius: "14px",
            border: "1px solid #E5E7EB",
            outline: "none",
            fontSize: "16px",
          }}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid #E5E7EB",
            outline: "none",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "22px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          maxWidth: "700px",
        }}
      >
        <h2 style={{ color: "#1F2937", marginTop: 0 }}>Order Summary</h2>

        {cart.length === 0 && <p style={{ color: "#6B7280" }}>Your cart is empty</p>}

        {cart.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #F3F4F6",
              color: "#374151",
              fontSize: "16px",
            }}
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span style={{ fontWeight: "700", color: "#E67E22" }}>
              Rs {item.price * item.quantity}
            </span>
          </div>
        ))}

        <h3 style={{ marginTop: "24px", color: "#1F2937", fontSize: "24px" }}>
          Total: <span style={{ color: "#E67E22" }}>Rs {total}</span>
        </h3>

        {cart.length > 0 && (
          <button
            onClick={handleOrder}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "16px 25px",
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
            Confirm Order
          </button>
        )}
      </div>
    </div>
  );
}

export default Checkout;