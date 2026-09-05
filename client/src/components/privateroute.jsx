import { Navigate } from "react-router-dom";

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
export default PrivateRoute