import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate
} from "react-router-dom";

import Admin from "./Admin";
import Menu from "./Menu";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Kitchen from "./Kitchen";
import TableQR from "./TableQR";
import TrackOrder from "./TrackOrder";
import Waiter from "./Waiter";
import Login from "./Login";

/* ================= PROTECTED ROUTE ================= */

function PrivateRoute({ role, user, children }) {

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role
  if (role && user.role !== role) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h1>❌ Access Denied</h1>
        <p>You are not allowed to access this page</p>
      </div>
    );
  }

  return children;
}

/* ================= NAVBAR ================= */

function Navbar({ cart, user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar =
    location.pathname.includes("admin") ||
    location.pathname.includes("waiter") ||
    location.pathname.includes("kitchen") ||
    location.pathname.includes("login");

  if (hideNavbar) return null;

  const logout = () => {
    localStorage.clear(); // ✅ important
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ color: "white", margin: 0 }}>
        🍽 Smart Restaurant
      </h2>

      <div>
        <Link to="/" style={navLink}>Menu</Link>

        <Link to="/cart" style={navLink}>
          🛒 Cart ({cart.length})
        </Link>

        {!user ? (
          <Link to="/login" style={navLink}>Login</Link>
        ) : (
          <>
            {user.role === "admin" && (
              <Link to="/admin" style={navLink}>Admin</Link>
            )}
            {user.role === "waiter" && (
              <Link to="/waiter" style={navLink}>Waiter</Link>
            )}
            {user.role === "kitchen" && (
              <Link to="/kitchen" style={navLink}>Kitchen</Link>
            )}

            <button onClick={logout} style={logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ================= STYLES ================= */

const navStyle = {
  background: "#ff6b00",
  padding: "15px 25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const navLink = {
  margin: "0 10px",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};

const logoutBtn = {
  marginLeft: "10px",
  padding: "6px 12px",
  border: "none",
  background: "white",
  color: "#ff6b00",
  borderRadius: "6px",
  cursor: "pointer"
};

/* ================= MAIN APP ================= */

function App() {
  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      console.log(JSON.parse(savedUser))
      return JSON.parse(savedUser);
    }

    return null;
  });

  return (
    <Router>

      <Navbar cart={cart} user={user} setUser={setUser} />

      <Routes>

        {/* CUSTOMER */}
        <Route path="/" element={<Menu cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} />} />
        <Route path="/track/:id" element={<TrackOrder />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* PROTECTED */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin" user={user}>
              <Admin />
            </PrivateRoute>
          }
        />

        <Route
          path="/waiter"
          element={
            <PrivateRoute role="admin" user={user}>
              <Waiter />
            </PrivateRoute>
          }
        />

        <Route
          path="/kitchen"
          element={
            <PrivateRoute role="admin" user={user}>
              <Kitchen />
            </PrivateRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <PrivateRoute role="admin" user={user}>
              <TableQR />
            </PrivateRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;