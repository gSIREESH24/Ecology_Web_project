import { useState } from "react";
import api from "../../api";
import RoleSelector from "./RoleSelector";

export default function LoginForm({
  form,
  handleChange,
  setStep,
  setForm,
  setProfileValues,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const res = await api.post("/auth/login", {
        mobile: form.phone,
        password: form.password,
        role: form.role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (!res.data.user.profileComplete) {
        setForm((prev) => ({
          ...prev,
          name: res.data.user.name || "",
          phone: res.data.user.mobile || prev.phone,
          location: res.data.user.location || "",
          role: res.data.user.role || prev.role,
        }));
        setProfileValues(res.data.user.profile || {});
        setStep("profile");
        return;
      }

      if (res.data.user.role === "farmer") {
        window.location.href = "/farmer-dashboard";
      } else if (res.data.user.role === "aggregator") {
        window.location.href = "/aggregator-dashboard";
      } else {
        window.location.href = "/industry-dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="agri-title">Welcome Back</h1>
      <p className="agri-sub">Sign in to your AgriCycle account.</p>

      <form className="agri-form" onSubmit={handleSignIn} noValidate>
        <div className="form-grid single">
          <div className="form-group full">
            <label>📞 Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          <div className="form-group full">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
            />
          </div>

          <div className="form-group full">
            <label>Select Role</label>
            <RoleSelector
              value={form.role}
              onChange={(val) => handleChange({ target: { name: "role", value: val } })}
            />
          </div>
        </div>

        {error && <div className="server-error">{error}</div>}

        <button type="submit" className="cta-btn" disabled={submitting}>
          {submitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="switch-text">
        Don&apos;t have an account?{" "}
        <button type="button" className="link-btn" onClick={() => setStep("signup")}>
          Sign Up
        </button>
      </p>
    </>
  );
}