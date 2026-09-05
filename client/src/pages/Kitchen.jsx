import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const res = await axios.get("http://localhost:5000/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(res.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error.response?.data || error.message);
    }
  };

  /* ================= SOCKET ================= */

  useEffect(() => {
    fetchOrders();

    const socket = io("http://localhost:5000");

    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);

      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    });

    // ✅ FIX: keep UI in sync
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );
    });

    return () => socket.disconnect();
  }, [soundEnabled]);

  /* ================= SOUND ================= */

  const enableSound = () => {
    setSoundEnabled(true);
    audioRef.current?.play().catch(() => {});
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // instant UI update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status } : o
        )
      );

    } catch (error) {
      console.error("❌ Update error:", error.response?.data || error.message);
    }
  };

  /* ================= FILTER ================= */

  const newOrders = orders.filter((o) => o.status === "Pending");
  const preparingOrders = orders.filter((o) => o.status === "Preparing");
  const readyOrders = orders.filter((o) => o.status === "Ready");

  /* ================= UI ================= */

  const renderOrderCard = (order) => (
    <div key={order._id} style={cardStyle}>
      <div style={headerRow}>
        <h3 style={titleStyle}>🍽 Table {order.tableNumber}</h3>
        <span style={statusStyle(order.status)}>
          {order.status}
        </span>
      </div>

      <p style={customerStyle}>
        👤 <strong>{order.customerName}</strong>
      </p>

      <div style={itemsBox}>
        <p style={itemsTitle}>Items</p>

        {order.items?.map((item, index) => (
          <div key={index} style={itemRow}>
            <span>{item.name}</span>
            <span>× {item.quantity}</span>
          </div>
        ))}
      </div>

      <div style={btnRow}>
        <button onClick={() => updateStatus(order._id, "Preparing")} style={btnPrimary}>
          Start Cooking
        </button>

        <button onClick={() => updateStatus(order._id, "Ready")} style={btnDark}>
          Ready
        </button>

        <button onClick={() => updateStatus(order._id, "Served")} style={btnDanger}>
          Served
        </button>
      </div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={topBar}>
          <div>
            <h1 style={mainTitle}>Kitchen Display</h1>
            <p style={subtitle}>Live restaurant order management</p>
          </div>

          {!soundEnabled ? (
            <button onClick={enableSound} style={soundBtn}>
              🔊 Enable Sound
            </button>
          ) : (
            <div style={soundEnabledBox}>🔔 Sound Enabled</div>
          )}
        </div>

        <audio ref={audioRef} src="/notification.mp3" preload="auto" />

        {/* GRID */}
        <div style={grid}>
          <div style={section}>
            <h2 style={sectionTitle}>🆕 New Orders</h2>
            {newOrders.length ? newOrders.map(renderOrderCard) : <p>No orders</p>}
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>🍳 Preparing</h2>
            {preparingOrders.length ? preparingOrders.map(renderOrderCard) : <p>No orders</p>}
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>✅ Ready</h2>
            {readyOrders.length ? readyOrders.map(renderOrderCard) : <p>No orders</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  background: "#FFF8F2",
  padding: "30px 20px",
  fontFamily: "Arial"
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap"
};

const mainTitle = {
  fontSize: "40px",
  fontWeight: "800",
  margin: 0
};

const subtitle = {
  color: "#666"
};

const soundBtn = {
  padding: "12px 20px",
  background: "#F4A261",
  border: "none",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer"
};

const soundEnabledBox = {
  background: "#fff",
  padding: "10px 15px",
  borderRadius: "10px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px"
};

const section = {
  background: "#fff",
  padding: "20px",
  borderRadius: "20px"
};

const sectionTitle = {
  fontWeight: "800"
};

const cardStyle = {
  background: "#fff",
  padding: "15px",
  borderRadius: "15px",
  marginBottom: "15px"
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between"
};

const titleStyle = {
  margin: 0
};

const customerStyle = {
  color: "#555"
};

const itemsBox = {
  background: "#f9f9f9",
  padding: "10px",
  borderRadius: "10px"
};

const itemsTitle = {
  fontWeight: "bold"
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between"
};

const btnRow = {
  display: "flex",
  gap: "10px",
  marginTop: "10px"
};

const btnPrimary = {
  background: "#F4A261",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnDark = {
  background: "#333",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const btnDanger = {
  background: "#E76F51",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const statusStyle = (status) => ({
  padding: "5px 10px",
  borderRadius: "10px",
  fontSize: "12px",
  background:
    status === "Pending"
      ? "#FFE5D0"
      : status === "Preparing"
      ? "#FFF3CD"
      : "#D1FAE5"
});

export default Kitchen;