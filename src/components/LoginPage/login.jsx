import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Link,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "./login.css";

import Lottie from "lottie-react";
import hii from "../../assets/animations/hii.json";
import logo from "../../assets/logo.png";
import { useAuthSide } from "../../context/AuthContext";


export default function AuthPageMUI({ onLoginSuccess }) {
  const { side, setSide } = useAuthSide();

  const [showPass, setShowPass] = useState(false);
  const [showPassSign, setShowPassSign] = useState(false);

  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const validEmail = (e) => /\S+@\S+\.\S+/.test(e);
  const validPassword = (p) => /^(?=.*\d)(?=.*[A-Za-z]).{6,}$/.test(p);
  const phoneRegex = (q) => /^[6-9]\d{9}$/.test(q);

  /* AUTO-HIDE ERRORS */
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 2000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  /* AUTO-HIDE FORGOT MESSAGES */
  useEffect(() => {
    if (forgotMsg || forgotError) {
      const timer = setTimeout(() => {
        setForgotMsg("");
        setForgotError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [forgotMsg, forgotError]);

  /* AUTO-HIDE LOGIN SUCCESS POPUP */
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  /* AUTO-HIDE SIGNUP SUCCESS POPUP */
  useEffect(() => {
    if (signupSuccess) {
      const timer = setTimeout(() => setSignupSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [signupSuccess]);

  /* -----------------------------------
        SIGN IN
  ------------------------------------*/
  const handleSignin = (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!validEmail(signin.email)) newErrors.signinEmail = "Invalid email";
    if (!validPassword(signin.password))
      newErrors.signinPassword = "Password must be at least 6 characters and include a number";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    // Fake login success
    sessionStorage.setItem("userName", signin.email);

    setSuccessMsg(`Welcome back!`);

    setTimeout(() => {
      onLoginSuccess?.();
    }, 800);
  };

  /* -----------------------------------
        SIGN UP
  ------------------------------------*/
  const handleSignup = (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!signup.name.trim()) newErrors.name = "User name required";
    if (!validEmail(signup.email)) newErrors.email = "Invalid email";
    if (signup.age < 0 || signup.age > 150) newErrors.age = "Age must be 0-150";
    if (!validPassword(signup.password))
      newErrors.password = "Password must be at least 6 characters and include a number";
    if (!phoneRegex(signup.phone))
      newErrors.phone = "Enter valid phone number";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    // Save user locally
    localStorage.setItem("user", JSON.stringify(signup));

    setSignupSuccess("Account created successfully! Please sign in.");

    setSide("signin");
    setSignin((s) => ({ ...s, email: signup.email }));
  };
  /* -----------------------------------
      FORGOT PASSWORD
  ------------------------------------*/

  const handleForgot = (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotError("Enter your email");
      return;
    }

    if (!validEmail(forgotEmail)) {
      setForgotError("Invalid email address");
      return;
    }

    setForgotMsg("Password reset link sent to your email");
    setForgotEmail("");
  };
  /* -----------------------------------
        UI + RENDER
  ------------------------------------*/
  const isSignin = side === "signin";

  return (
    <Container maxWidth={false} disableGutters className="auth-container">

      {/* LOGIN SUCCESS POPUP */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #4CAF7D, #56A1CF)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              fontWeight: 600,
              zIndex: 9999,
            }}
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGNUP SUCCESS POPUP */}
      <AnimatePresence>
        {signupSuccess && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #56A1CF, #4CAF7D)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              fontWeight: 600,
              zIndex: 9999,
            }}
          >
            {signupSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CARD */}
      <motion.div
        className={`auth-card ${side === "signup" ? "flipped" : ""}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* FORM SIDE */}
        <Paper elevation={6} className="auth-form-side">
          <Box className="auth-header">
            <motion.div
              className="logo-container"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <img src={logo} alt="Logo" className="navbar-logo" />
            </motion.div>
            <Typography variant="h4" className="brand-name">
              EcoStubble
            </Typography>
            <Typography className="auth-description">
              {isSignin
                ? "Sign in to manage your fields, reports, and eco-impact in one place."
                : "Join EcoStubble and start tracking cleaner farming actions with a simple setup."}
            </Typography>
          </Box>

          <AnimatePresence mode="wait">
            {isSignin ? (
              /* ------------ SIGN IN FORM ------------ */
              <motion.form
                key="signin"
                onSubmit={handleSignin}
                className="auth-form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  size="small"
                  margin="normal"
                  value={signin.email}
                  error={!!errors.signinEmail}
                  helperText={errors.signinEmail}
                  onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  size="small"
                  type={showPass ? "text" : "password"}
                  margin="normal"
                  value={signin.password}
                  error={!!errors.signinPassword}
                  helperText={errors.signinPassword || "At least 6 characters & 1 number"}
                  onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass(!showPass)}>
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className="form-actions">
                  <Button type="submit" variant="contained" className="submit-btn">
                    Sign In
                  </Button>
                  <Link
                    href="#forgot"
                    underline="hover"
                    className="forgot-link"
                    onClick={() =>
                      document.getElementById("forgot-block")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Forgot Password?
                  </Link>
                </Box>

                {/* FORGOT SECTION */}
                <Box id="forgot-block" className="forgot-section">
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
                    Forgot password?
                  </Typography>

                  <Box className="forgot-form">
                    <TextField
                      size="small"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      error={!!forgotError}
                      helperText={forgotError}
                      className="forgot-input"
                    />
                    <Button variant="outlined" className="forgot-btn" onClick={handleForgot}>
                      Generate Link
                    </Button>
                  </Box>

                  {forgotMsg && (
                    <Typography sx={{ fontSize: "14px", color: "#4CAF7D", fontWeight: 600, mt: 2 }}>
                      {forgotMsg}
                    </Typography>
                  )}

                </Box>
              </motion.form>
            ) : (
              /* ------------ SIGN UP FORM ------------ */
              <motion.form
                key="signup"
                onSubmit={handleSignup}
                className="auth-form"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              >
                <Typography className="signup-note" variant="body2">
                  You can upload further details later from Profile Page!
                </Typography>

                <TextField
                  fullWidth
                  label="User Name"
                  size="small"
                  margin="normal"
                  value={signup.name}
                  error={!!errors.name}
                  helperText={errors.name}
                  onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  size="small"
                  margin="normal"
                  value={signup.phone}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  onChange={(e) => setSignup({ ...signup, phone: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Email"
                  size="small"
                  margin="normal"
                  value={signup.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassSign ? "text" : "password"}
                  size="small"
                  margin="normal"
                  value={signup.password}
                  error={!!errors.password}
                  onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassSign(!showPassSign)}>
                          {showPassSign ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Age"
                  type="number"
                  size="small"
                  inputProps={{ min: 0, max: 150 }}
                  value={signup.age}
                  error={!!errors.age}
                  helperText={errors.age}
                  onChange={(e) => setSignup({ ...signup, age: e.target.value })}
                  className="metric-field"
                />

                <Button type="submit" variant="contained" className="submit-btn">
                  Sign Up
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Paper>

        {/* PANEL SIDE */}
        <motion.div
          className={`auth-panel-side ${side === "signup" ? "signup-mode" : ""}`}
          animate={{
            background:
              side === "signin"
                ? "linear-gradient(135deg, #4CAF7D, #56A1CF)"
                : "linear-gradient(135deg, #56A1CF, #4CAF7D)",
          }}
          transition={{ duration: 0.6 }}
        >
          <Box className="panel-orb panel-orb-one" />
          <Box className="panel-orb panel-orb-two" />
          <Box className="panel-content">
            <Box
              className="panel-animation"
            >
              <Lottie animationData={hii} loop={true} height="100%" />
            </Box>

            {isSignin ? (
              <>
                <Typography className="panel-badge">
                  Start your journey
                </Typography>
                <Typography variant="h4" className="panel-title">
                  New here?
                </Typography>
                <Typography className="panel-text">
                  Create an account and start helping reduce stubble burning.
                </Typography>
                <Button
                  variant="contained"
                  className="panel-btn"
                  onClick={() => setSide("signup")}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                <Typography className="panel-badge">
                  Great to see you
                </Typography>
                <Typography variant="h4" className="panel-title">
                  Already have an account?
                </Typography>
                <Typography className="panel-text">
                  Sign in to continue and access your dashboard.
                </Typography>
                <Button
                  variant="contained"
                  className="panel-btn"
                  onClick={() => setSide("signin")}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
}
