import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ added

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Login failed");
      }

      // ✅ SINGLE SOURCE OF TRUTH
      const userData = { role: data.role };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      // ✅ FIX: use React navigation (NO page reload)
      navigate(`/${data.role}`);

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={title}>🔐 Staff Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5"
};

const formStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const title = {
  textAlign: "center",
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#ff6b00",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default Login;