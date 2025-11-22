import React, { useState } from "react";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  // Controlled inputs for login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login form submit
  const submit = async (e) => {
    e.preventDefault();
    try {
      // Call backend /api/auth/login
      const res = await login(username, password);
      const data = res.data;

      // Store JWT token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Also store username to show "Welcome <name>" in navbar
      localStorage.setItem("username", username);

      toast.success("Logged in");

      // Redirect based on role
      if (data.role === "ROLE_ADMIN") navigate("/admin");
      else navigate("/inquiries");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card p-4" style={{ width: 420 }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* Login form */}
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

          <button className="btn btn-primary w-100 mt-2">Login</button>
        </form>
      </div>
    </div>
  );
}
