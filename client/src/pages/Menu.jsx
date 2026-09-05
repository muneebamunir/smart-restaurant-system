import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import socket from "../socket";
 
function Menu({ cart, setCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const tableNumber =
    params.get("table") || localStorage.getItem("tableNumber");

  useEffect(() => {
    if (params.get("table")) {
      localStorage.setItem("tableNumber", params.get("table"));
    }
  }, [location.search]);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300x200?text=Food";
    return `http://localhost:5000/uploads/${img}`;
  };

  useEffect(() => {
    fetch("http://localhost:5000/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.log("Menu fetch error:", err));
  }, []);

  const callWaiter = () => {
    if (!tableNumber) return alert("Please scan table QR first");
    if (!socket || !socket.connected)
      return alert("Connection lost. Please refresh page.");

    socket.emit("callWaiter", {
      tableNumber,
      time: new Date(),
    });

    alert("✅ Waiter is coming!");
  };

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const categoryOrder = [
    "Fast Food",
    "BBQ",
    "Desi",
    "Side Dish",
    "Drinks",
  ];

  const filteredMenu = menuItems.filter((item) => {
    return (
      (category === "All" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const popularItems = menuItems.slice(0, 4);

  const sectionItems =
    category === "All"
      ? filteredMenu
      : filteredMenu.filter((item) => item.category === category);

  const cardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.12)";
  };

  const cardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
  };

  return (
    <div
      style={{
        background: "#F8F5F0",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "40px",
      }}
    >
      {/* TOP HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #E67E22, #D35400)",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          padding: "25px 20px 30px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
        }}
      >
        {/* TOP ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                color: "white",
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              The Gourmet Table
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.95)",
                marginTop: "8px",
                fontSize: "18px",
              }}
            >
              Order from your table
            </p>

            {tableNumber ? (
              <p
                style={{
                  color: "#fff",
                  marginTop: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                🍽 Table: {tableNumber}
              </p>
            ) : (
              <p
                style={{
                  color: "#fff",
                  marginTop: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                Scan table QR code
              </p>
            )}
          </div>

          <Link to={`/cart${tableNumber ? `?table=${tableNumber}` : ""}`}>
            <div
              style={{
                background: "white",
                width: "62px",
                height: "62px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "28px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
                cursor: "pointer",
                position: "relative",
                transition: "0.3s ease",
              }}
            >
              🛒
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "#1F2937",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {cart.length}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* SEARCH */}
        <div
          style={{
            background: "white",
            borderRadius: "30px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
          }}
        >
          <span style={{ fontSize: "24px", color: "#9CA3AF" }}>🔍</span>
          <input
            type="text"
            placeholder="Search for dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "18px",
              background: "transparent",
              color: "#374151",
            }}
          />
        </div>
      </div>

      {/* CATEGORY BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          padding: "22px 20px 10px",
          scrollbarWidth: "none",
        }}
      >
        {["All", ...categoryOrder].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "12px 22px",
              borderRadius: "999px",
              border: "none",
              background: category === cat ? "#E67E22" : "white",
              color: category === cat ? "white" : "#4B5563",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "0.3s ease",
              boxShadow:
                category === cat
                  ? "0 8px 16px rgba(230,126,34,0.28)"
                  : "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* WAITER BUTTON */}
      <div style={{ padding: "10px 20px 0" }}>
        <button
          onClick={callWaiter}
          style={{
            width: "100%",
            background: "#1F2937",
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "18px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            transition: "0.3s ease",
          }}
        >
          🔔 Call Waiter
        </button>
      </div>

      {/* POPULAR ITEMS */}
      <div style={{ padding: "25px 20px 10px" }}>
        <h2
          style={{
            fontSize: "34px",
            marginBottom: "20px",
            color: "#1F2937",
            fontWeight: "700",
          }}
        >
          Popular Items
        </h2>

        <div
          style={{
           display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
gap: "20px",
maxWidth: "1200px",
margin: "0 auto",
          }}
        >
          {popularItems.map((item) => (
            <div
              key={item._id}
              onMouseEnter={cardHover}
              onMouseLeave={cardLeave}
              style={{
                background: "white",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  height: "300px",
                  overflow: "hidden",
                  background: "#F3F4F6",
                }}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ padding: "18px" }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "20px",
                    color: "#1F2937",
                    minHeight: "52px",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#E67E22",
                      fontSize: "26px",
                      fontWeight: "700",
                    }}
                  >
                    Rs {item.price}
                  </h4>

                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      border: "none",
                      background: "#E67E22",
                      color: "white",
                      fontSize: "30px",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(230,126,34,0.28)",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL / FILTERED ITEMS */}
      <div style={{ padding: "25px 20px 10px" }}>
        <h2
          style={{
            fontSize: "32px",
            marginBottom: "20px",
            color: "#1F2937",
            fontWeight: "700",
          }}
        >
          {category === "All" ? "All Dishes" : category}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {sectionItems.map((item) => (
            <div
              key={item._id}
              onMouseEnter={cardHover}
              onMouseLeave={cardLeave}
              style={{
                background: "white",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  height: "350px",
                  overflow: "hidden",
                  background: "#F3F4F6",
                }}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ padding: "18px" }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "20px",
                    color: "#1F2937",
                    minHeight: "52px",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#E67E22",
                      fontSize: "26px",
                      fontWeight: "700",
                    }}
                  >
                    Rs {item.price}
                  </h4>

                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      border: "none",
                      background: "#E67E22",
                      color: "white",
                      fontSize: "30px",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(230,126,34,0.28)",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sectionItems.length === 0 && (
          <p style={{ marginTop: "20px", color: "#6B7280", fontSize: "18px" }}>
            No dishes found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Menu;