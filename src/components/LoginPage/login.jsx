import { useEffect, useMemo, useState } from "react";
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
import { useAuthSide, useAuth } from "../../context/AuthContext";
import RoleSelector from "./RoleSelector";
import ProfileCompletionForm from "./ProfileCompletionForm";

const validEmail = (value) => /\S+@\S+\.\S+/.test(value.trim());
const validPassword = (value) => /^(?=.*\d)(?=.*[A-Za-z]).{6,}$/.test(value);
const validPhone = (value) => /^[6-9]\d{9}$/.test(value.trim());
const validPincode = (value) => /^\d{6}$/.test(value.trim());

const emptyProfileState = {
  location: "",
  pincode: "",
  landSize: "",
  operatingArea: "",
  storageCapacity: "",
  vehicleType: "",
  experience: "",
  companyName: "",
  industryType: "",
};

export default function AuthPageMUI() {
  const { side, setSide } = useAuthSide();
  const { register, login, completeProfile, session } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showPassSign, setShowPassSign] = useState(false);
  const [authStep, setAuthStep] = useState("form");

  const [signin, setSignin] = useState({ identifier: "", password: "", role: "" });
  const [signup, setSignup] = useState({
    name: "",
    identifier: "",
    password: "",
    role: "",
  });
  const [profileData, setProfileData] = useState(emptyProfileState);

  const [errors, setErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [errors]);

  useEffect(() => {
    if (forgotMsg || forgotError) {
      const timer = setTimeout(() => {
        setForgotMsg("");
        setForgotError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [forgotMsg, forgotError]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [successMsg]);

  useEffect(() => {
    if (signupSuccess) {
      const timer = setTimeout(() => setSignupSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [signupSuccess]);

  useEffect(() => {
    if (side === "signup") {
      setErrors({});
      setForgotError("");
      setForgotMsg("");
      setAuthStep("form");
    }
  }, [side]);

  const activeRole = useMemo(
    () => (authStep === "profile" ? session?.role || signup.role : side === "signin" ? signin.role : signup.role),
    [authStep, session?.role, side, signin.role, signup.role]
  );

  const handleSignin = (event) => {
    event.preventDefault();
    setErrors({});
    const nextErrors = {};

    if (!signin.identifier.trim()) nextErrors.signinIdentifier = "Enter name, email or phone";
    if (!signin.role) nextErrors.signinRole = "Select role";
    if (!validPassword(signin.password)) {
      nextErrors.signinPassword = "Password must be at least 6 characters and include a number";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = login(signin);

    if (!result.ok) {
      setErrors({ signinPassword: result.message });
      return;
    }

    if (!result.user.profileComplete) {
      setSignupSuccess("Sign in successful. Please complete your role details.");
      setAuthStep("profile");
      setProfileData({ ...emptyProfileState, ...(result.user.profile || {}) });
      return;
    }

    setSuccessMsg("Sign in successful!");
  };

  const handleSignup = (event) => {
    event.preventDefault();
    setErrors({});
    const nextErrors = {};

    if (!signup.name.trim()) nextErrors.name = "User name required";
    if (!signup.identifier.trim()) {
      nextErrors.identifier = "Phone or email required";
    } else if (!validEmail(signup.identifier) && !validPhone(signup.identifier)) {
      nextErrors.identifier = "Enter valid phone number or email";
    }
    if (!signup.role) nextErrors.role = "Select role";
    if (!validPassword(signup.password)) {
      nextErrors.password = "Password must be at least 6 characters and include a number";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = register(signup);

    if (!result.ok) {
      setErrors({ identifier: result.message });
      return;
    }

    setSignupSuccess("Account created. Just add role details to continue.");
    setProfileData({ ...emptyProfileState });
    setAuthStep("profile");
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const role = session?.role || signup.role;
    const nextErrors = {};

    if (role === "farmer") {
      if (!profileData.location.trim()) nextErrors.location = "Location is required";
      if (!validPincode(profileData.pincode || "")) nextErrors.pincode = "Enter a valid 6-digit pincode";
      if (!`${profileData.landSize}`.trim()) nextErrors.landSize = "Land size is required";
    }

    if (role === "aggregator") {
      if (!profileData.operatingArea.trim()) nextErrors.operatingArea = "Operating area is required";
      if (!validPincode(profileData.pincode || "")) nextErrors.pincode = "Enter a valid 6-digit pincode";
      if (!`${profileData.storageCapacity}`.trim()) nextErrors.storageCapacity = "Storage capacity is required";
      if (!profileData.vehicleType.trim()) nextErrors.vehicleType = "Vehicle type is required";
      if (!profileData.experience.trim()) nextErrors.experience = "Experience is required";
    }

    if (role === "industry") {
      if (!profileData.companyName.trim()) nextErrors.companyName = "Company name is required";
      if (!profileData.industryType.trim()) nextErrors.industryType = "Industry type is required";
      if (!profileData.location.trim()) nextErrors.location = "Location is required";
      if (!validPincode(profileData.pincode || "")) nextErrors.pincode = "Enter a valid 6-digit pincode";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = completeProfile(profileData);

    if (!result.ok) {
      setErrors({ profile: result.message });
      return;
    }

    setSignupSuccess("Profile completed successfully!");
  };

  const handleForgot = (event) => {
    event.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotError("Enter your phone or email");
      return;
    }

    if (!validEmail(forgotEmail) && !validPhone(forgotEmail)) {
      setForgotError("Invalid phone or email");
      return;
    }

    setForgotMsg("Password reset link sent");
    setForgotEmail("");
  };

  const isSignin = side === "signin";
  const showProfileStep = authStep === "profile";

  return (
    <Container maxWidth={false} disableGutters className="auth-container">
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

      <motion.div
        className={`auth-card ${side === "signup" ? "flipped" : ""}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
              {showProfileStep
                ? "Almost done. Add the key details for your role now, and you can update the rest later from your profile page."
                : isSignin
                  ? "Sign in to manage your fields, reports, and eco-impact in one place."
                  : "Join EcoStubble with a short signup, then finish only the details your role needs."}
            </Typography>
          </Box>

          <AnimatePresence mode="wait">
            {showProfileStep ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              >
                {errors.profile ? (
                  <Typography className="profile-error">{errors.profile}</Typography>
                ) : null}
                <ProfileCompletionForm
                  role={activeRole}
                  values={profileData}
                  errors={errors}
                  onChange={(name, value) =>
                    setProfileData((current) => ({ ...current, [name]: value }))
                  }
                  onSubmit={handleProfileSubmit}
                  onBack={() => setAuthStep("form")}
                />
              </motion.div>
            ) : isSignin ? (
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
                  label="Name / Email / Phone"
                  size="small"
                  margin="normal"
                  value={signin.identifier}
                  error={!!errors.signinIdentifier}
                  helperText={errors.signinIdentifier}
                  onChange={(event) => setSignin({ ...signin, identifier: event.target.value })}
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
                  onChange={(event) => setSignin({ ...signin, password: event.target.value })}
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

                <Typography className="role-label">Select Role</Typography>
                <RoleSelector
                  value={signin.role}
                  onChange={(role) => {
                    setSignin((current) => ({ ...current, role }));
                    setErrors((current) => ({ ...current, signinRole: "" }));
                  }}
                />
                {errors.signinRole ? (
                  <Typography className="role-error">{errors.signinRole}</Typography>
                ) : null}

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

                <Box id="forgot-block" className="forgot-section">
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
                    Forgot password?
                  </Typography>

                  <Box className="forgot-form">
                    <TextField
                      size="small"
                      placeholder="Enter phone or email"
                      value={forgotEmail}
                      onChange={(event) => setForgotEmail(event.target.value)}
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
                  Create your account first. Role details come right after this step, and you can finish the rest later from your profile page.
                </Typography>

                <TextField
                  fullWidth
                  label="User Name"
                  size="small"
                  margin="normal"
                  value={signup.name}
                  error={!!errors.name}
                  helperText={errors.name}
                  onChange={(event) => setSignup({ ...signup, name: event.target.value })}
                />

                <TextField
                  fullWidth
                  label="Phone Number or Email"
                  size="small"
                  margin="normal"
                  value={signup.identifier}
                  error={!!errors.identifier}
                  helperText={errors.identifier}
                  onChange={(event) => setSignup({ ...signup, identifier: event.target.value })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassSign ? "text" : "password"}
                  size="small"
                  margin="normal"
                  value={signup.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(event) => setSignup({ ...signup, password: event.target.value })}
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

                <Typography className="role-label">Select a role</Typography>
                <RoleSelector
                  value={signup.role}
                  onChange={(role) => {
                    setSignup((current) => ({ ...current, role }));
                    setErrors((current) => ({ ...current, role: "" }));
                  }}
                />
                {errors.role ? <Typography className="role-error">{errors.role}</Typography> : null}

                <Button type="submit" variant="contained" className="submit-btn signup-submit-btn">
                  Create Account
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Paper>

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
            <Box className="panel-animation">
              <Lottie animationData={hii} loop height="100%" />
            </Box>

            {showProfileStep ? (
              <>
                <Typography className="panel-badge">One more quick step</Typography>
                <Typography variant="h4" className="panel-title">
                  Your account is ready
                </Typography>
                <Typography className="panel-text">
                  Add a few role-specific details so we can personalize your experience from the start.
                </Typography>
                <Button variant="contained" className="panel-btn" onClick={() => setAuthStep("form")}>
                  Back to account form
                </Button>
              </>
            ) : isSignin ? (
              <>
                <Typography className="panel-badge">Start your journey</Typography>
                <Typography variant="h4" className="panel-title">
                  Need an account?
                </Typography>
                <Typography className="panel-text">
                  Create a role-based account in a minute and step into a cleaner, smarter workflow from day one.
                </Typography>
                <Button
                  variant="contained"
                  className="panel-btn"
                  onClick={() => {
                    setSide("signup");
                    setAuthStep("form");
                    setSignup((current) => ({ ...current, role: "" }));
                  }}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                <Typography className="panel-badge">Great to see you</Typography>
                <Typography variant="h4" className="panel-title">
                  Already have an account?
                </Typography>
                <Typography className="panel-text">
                  Jump back in and pick up your work with a dashboard shaped around your role.
                </Typography>
                <Button
                  variant="contained"
                  className="panel-btn"
                  onClick={() => {
                    setSide("signin");
                    setAuthStep("form");
                    setSignin((current) => ({ ...current, role: "" }));
                  }}
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
