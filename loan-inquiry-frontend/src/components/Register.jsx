import React, { useState } from "react";
import { register as registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  // Controlled form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Role for new user (Customer or Admin)
  const [role, setRole] = useState("USER");

  const navigate = useNavigate();

  // Handle registration submit
  const submit = async (e) => {
    e.preventDefault();
    try {
      // Call backend /api/auth/register
      await registerUser(username, password, role);
      toast.success("Registered. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to register");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card p-4" style={{ width: 420 }}>
        <h3 className="text-center mb-3">Register</h3>

        {/* Registration form */}
        <form onSubmit={submit}>
          <input
            className="form-control my-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="form-control my-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Dropdown to choose role (Customer or Admin) */}
          <select
            className="form-select my-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="btn btn-primary w-100 mt-2">Register</button>
        </form>
      </div>
    </div>
  );
}
