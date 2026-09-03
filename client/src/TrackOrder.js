import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();

    const socket = io("http://localhost:5000");

    socket.on("orderUpdated", (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const getStep = (status) => {
    if (status === "Pending") return 1;
    if (status === "Preparing") return 2;
    if (status === "Ready") return 3;
    if (status === "Served") return 4;
    return 1;
  };

  if (!order)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FFF8F2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          color: "#2D3748",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Loading...
      </div>
    );

  const currentStep = getStep(order.status);

  const steps = [
    { label: "Received", icon: "📝" },
    { label: "Preparing", icon: "👨‍🍳" },
    { label: "Ready", icon: "🍽" },
    { label: "Served", icon: "✅" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF8F2",
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: "35px 25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              color: "#2D3748",
              fontWeight: "800",
            }}
          >
            Track Your Order
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6B7280",
              fontSize: "18px",
            }}
          >
            Stay updated with your meal status
          </p>
        </div>

        <div
          style={{
            background: "#FFF4EA",
            border: "1px solid #F1E3D3",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#2D3748" }}>
            🍽 Table {order.tableNumber}
          </h2>

          <h3
            style={{
              margin: 0,
              color: "#F4A261",
              fontSize: "28px",
              fontWeight: "800",
            }}
          >
            {order.status}
          </h3>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "26px",
                left: "8%",
                right: "8%",
                height: "6px",
                background: "#F1E3D3",
                zIndex: 0,
                borderRadius: "999px",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "26px",
                left: "8%",
                width: `${(currentStep - 1) * 33}%`,
                height: "6px",
                background: "#F4A261",
                zIndex: 1,
                borderRadius: "999px",
                transition: "0.4s ease",
              }}
            />

            {steps.map((step, index) => {
              const active = index + 1 <= currentStep;

              return (
                <div
                  key={index}
                  style={{
                    zIndex: 2,
                    textAlign: "center",
                    width: "25%",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      margin: "0 auto 10px",
                      borderRadius: "50%",
                      background: active ? "#F4A261" : "#F7E8D8",
                      color: active ? "white" : "#9CA3AF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                      boxShadow: active
                        ? "0 8px 18px rgba(244,162,97,0.28)"
                        : "none",
                    }}
                  >
                    {step.icon}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "700",
                      color: active ? "#2D3748" : "#9CA3AF",
                    }}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div
          style={{
            marginTop: "35px",
            background: "#FFFFFF",
            border: "1px solid #F1E3D3",
            borderRadius: "20px",
            padding: "22px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "15px",
              color: "#2D3748",
              fontSize: "24px",
            }}
          >
            Order Details
          </h3>

          <p style={{ color: "#6B7280", fontSize: "17px", marginBottom: "10px" }}>
            <strong style={{ color: "#2D3748" }}>Customer:</strong>{" "}
            {order.customerName}
          </p>

          <p style={{ color: "#6B7280", fontSize: "17px", marginBottom: "10px" }}>
            <strong style={{ color: "#2D3748" }}>Phone:</strong> {order.phone}
          </p>

          <p style={{ color: "#6B7280", fontSize: "17px", marginBottom: "10px" }}>
            <strong style={{ color: "#2D3748" }}>Total:</strong> Rs {order.total}
          </p>

          <div style={{ marginTop: "18px" }}>
            <strong style={{ color: "#2D3748", fontSize: "18px" }}>Items:</strong>

            <div style={{ marginTop: "12px" }}>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "#FFF8F2",
                    borderRadius: "14px",
                    padding: "12px 15px",
                    marginBottom: "10px",
                    color: "#2D3748",
                    fontWeight: "600",
                  }}
                >
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;