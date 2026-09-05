import React, { useEffect, useState } from "react";
import socket from "../socket";

function Waiter() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    console.log("🟢 Waiter page mounted");

    const onConnect = () => {
      console.log("🟢 Socket connected:", socket.id);
    };

    const onWaiterAlert = (data) => {
      console.log("🔔 NEW CALL RECEIVED:", data);
      setCalls((prev) => [data, ...prev]);
    };

    socket.on("connect", onConnect);
    socket.on("waiterAlert", onWaiterAlert);

    return () => {
      socket.off("connect", onConnect);
      socket.off("waiterAlert", onWaiterAlert);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF8F2",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              color: "#2D3748",
              fontWeight: "800",
            }}
          >
            Waiter Screen
          </h1>

          <p style={{ color: "#6B7280", fontSize: "18px", marginTop: "10px" }}>
            Live table assistance requests
          </p>
        </div>

        {calls.length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "28px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ color: "#2D3748", marginBottom: "10px" }}>No calls yet</h2>
            <p style={{ color: "#6B7280", fontSize: "17px" }}>
              Waiting for customer assistance requests...
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {calls.map((call, index) => (
              <div
                key={index}
                style={{
                  background: "#FFFFFF",
                  padding: "24px",
                  borderRadius: "24px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  border: "1px solid #F1E3D3",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#F4A261",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "30px",
                    marginBottom: "18px",
                    boxShadow: "0 10px 20px rgba(244,162,97,0.25)",
                  }}
                >
                  🔔
                </div>

                <h2
                  style={{
                    margin: "0 0 10px",
                    color: "#2D3748",
                    fontSize: "28px",
                  }}
                >
                  Table {call.tableNumber}
                </h2>

                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "16px",
                    marginBottom: "20px",
                  }}
                >
                  Time:{" "}
                  {call.time ? new Date(call.time).toLocaleTimeString() : "N/A"}
                </p>

                <div
                  style={{
                    background: "#FFF4EA",
                    color: "#F4A261",
                    display: "inline-block",
                    padding: "10px 16px",
                    borderRadius: "999px",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                >
                  Assistance Needed
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Waiter;