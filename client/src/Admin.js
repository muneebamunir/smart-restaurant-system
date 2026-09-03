import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    const res = await axios.get("http://localhost:5000/menu");
    setMenuItems(res.data);
  };

  const fetchOrders = async () => {
  try {
    if (!token) return; // ✅ prevent crash

    const res = await axios.get("http://localhost:5000/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders(res.data);
  } catch (err) {
    console.log("Orders fetch error:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    fetchMenu();
    fetchOrders();

    const socket = io("http://localhost:5000");

    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/menu", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Menu item added!");

      setName("");
      setPrice("");
      setCategory("");
      setImage(null);

      fetchMenu();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMenu();
  };

  const editItem = (item) => {
    setEditId(item._id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
  };

  const updateItem = async () => {
    try {
      await axios.put(
        `http://localhost:5000/menu/${editId}`,
        {
          name,
          price,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Item updated!");

      setEditId(null);
      setName("");
      setPrice("");
      setCategory("");

      fetchMenu();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #F1E3D3",
    outline: "none",
    fontSize: "16px",
    background: "#FFF8F2",
    color: "#2D3748",
    boxSizing: "border-box",
  };

  const primaryBtn = {
    background: "#F4A261",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(244,162,97,0.25)",
  };

  const secondaryBtn = {
    background: "#2D3748",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const dangerBtn = {
    background: "#E76F51",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF8F2",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              color: "#2D3748",
              fontWeight: "800",
            }}
          >
            Admin Panel
          </h1>
          <p style={{ color: "#6B7280", fontSize: "18px", marginTop: "10px" }}>
            Manage menu items and customer orders
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#2D3748", marginTop: 0 }}>Add Menu Item</h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <input type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} />
              <input type="file" onChange={(e) => setImage(e.target.files[0])} style={inputStyle} />
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button type="submit" style={primaryBtn}>Add Food Item</button>

              {editId && (
                <button type="button" onClick={updateItem} style={secondaryBtn}>
                  Update Item
                </button>
              )}
            </div>
          </form>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#2D3748", marginTop: 0 }}>All Menu Items</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {menuItems.map((item) => (
              <div key={item._id} style={{ background: "#FFF8F2", border: "1px solid #F1E3D3", borderRadius: "22px", overflow: "hidden" }}>
                {item.image && (
                  <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                )}

                <div style={{ padding: "18px" }}>
                  <h3 style={{ margin: "0 0 10px", color: "#2D3748" }}>{item.name}</h3>
                  <p style={{ margin: "6px 0", color: "#6B7280" }}>Price: Rs {item.price}</p>
                  <p style={{ margin: "6px 0 16px", color: "#6B7280" }}>Category: {item.category}</p>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => editItem(item)} style={secondaryBtn}>Edit</button>
                    <button onClick={() => deleteItem(item._id)} style={dangerBtn}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#2D3748", marginTop: 0 }}>Customer Orders</h2>

          {orders.length === 0 && (
            <p style={{ color: "#6B7280", fontSize: "17px" }}>No orders yet</p>
          )}

          {orders.map((order) => (
            <div key={order._id} style={{ border: "1px solid #F1E3D3", background: "#FFF8F2", padding: "22px", marginBottom: "18px", borderRadius: "22px" }}>
              <h3 style={{ marginTop: 0, color: "#2D3748" }}>{order.customerName}</h3>

              <p style={{ color: "#6B7280" }}>📞 {order.phone}</p>
              <p style={{ color: "#6B7280" }}>🍽 Table: {order.tableNumber}</p>
              <p style={{ color: "#6B7280" }}>💰 Total: Rs {order.total}</p>

              <p style={{ marginTop: "10px", color: "#F4A261", fontWeight: "800" }}>
                Status: {order.status}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => updateStatus(order._id, "Preparing")} style={primaryBtn}>Preparing</button>
                <button onClick={() => updateStatus(order._id, "Ready")} style={secondaryBtn}>Ready</button>
                <button onClick={() => updateStatus(order._id, "Served")} style={dangerBtn}>Served</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Admin;