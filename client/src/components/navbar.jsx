import { Link,
  useLocation,
  useNavigate
} from "react-router-dom";

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
export default Navbar