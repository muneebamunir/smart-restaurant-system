import { useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

import Admin from "./pages/Admin"
import Menu from "./pages/Menu"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Kitchen from "./pages/Kitchen"
import TableQR from "./pages/TableQR"
import TrackOrder from "./pages/TrackOrder"
import Waiter from "./pages/Waiter"
import Login from "./pages/Login"
import PrivateRoute from "./components/privateroute"
import Navbar from "./components/navbar"



/* ================= MAIN APP ================= */

function App() {
  const [cart, setCart] = useState([])

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      console.log(JSON.parse(savedUser))
      return JSON.parse(savedUser)
    }

    return null
  })

  return (
    <Router>

      <Navbar cart={cart} user={user} setUser={setUser} />

      <Routes>

        {/* CUSTOMER */}
        <Route
          path="/"
          element={<Menu cart={cart} setCart={setCart} />} />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />} />

        <Route
          path="/checkout"
          element={<Checkout cart={cart} />} />

        <Route
          path="/track/:id"
          element={<TrackOrder />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />} />

        {/* PROTECTED */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin" user={user}>
              <Admin />
            </PrivateRoute>
          }/>

        <Route
          path="/waiter"
          element={
            <PrivateRoute role="admin" user={user}>
              <Waiter />
            </PrivateRoute>
          }/>

        <Route
          path="/kitchen"
          element={
            <PrivateRoute role="admin" user={user}>
              <Kitchen />
            </PrivateRoute>
          }/>

        <Route
          path="/tables"
          element={
            <PrivateRoute role="admin" user={user}>
              <TableQR />
            </PrivateRoute>
          }/>
      </Routes>
    </Router>
  )
}

export default App