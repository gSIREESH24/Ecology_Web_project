import { useState } from "react";
import "./login.css";
import api from "../../api";
import RoleSelector from "./RoleSelector";
import ProfileCompletionForm from "./ProfileCompletionForm";

const translations = {
  en: {
    join: "Join AgriCycle",
    subtitle: "Create your account and start making an impact.",
    signInTitle: "Welcome Back",
    signInSubtitle: "Sign in to your AgriCycle account.",
    fullName: "Full Name",
    namePlaceholder: "e.g. Ravi Kumar",
    phone: "Phone Number",
    phonePlaceholder: "e.g. 9876543210",
    location: "Location / Village / City",
    locationPlaceholder: "e.g. Amritsar, Punjab",
    password: "Password",
    passwordPlaceholder: "Min. 6 characters",
    selectRole: "Select Your Role",
    createAccount: "Create Account",
    alreadyHave: "Already have an account?",
    signIn: "Sign In",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
  },
  hi: {
    join: "AgriCycle से जुड़ें",
    subtitle: "अपना खाता बनाएं और प्रभाव डालना शुरू करें।",
    signInTitle: "वापस स्वागत है",
    signInSubtitle: "अपने AgriCycle खाते में साइन इन करें।",
    fullName: "पूरा नाम",
    namePlaceholder: "जैसे रवि कुमार",
    phone: "फ़ोन नंबर",
    phonePlaceholder: "जैसे 9876543210",
    location: "स्थान / गाँव / शहर",
    locationPlaceholder: "जैसे अमृतसर, पंजाब",
    password: "पासवर्ड",
    passwordPlaceholder: "न्यूनतम 6 अक्षर",
    selectRole: "अपनी भूमिका चुनें",
    createAccount: "खाता बनाएं",
    alreadyHave: "पहले से खाता है?",
    signIn: "साइन इन",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप",
  },
  pa: {
    join: "AgriCycle ਨਾਲ ਜੁੜੋ",
    subtitle: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ ਅਤੇ ਪ੍ਰਭਾਵ ਪਾਉਣਾ ਸ਼ੁਰੂ ਕਰੋ।",
    signInTitle: "ਵਾਪਸ ਆਓ",
    signInSubtitle: "ਆਪਣੇ AgriCycle ਖਾਤੇ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ।",
    fullName: "ਪੂਰਾ ਨਾਮ",
    namePlaceholder: "ਜਿਵੇਂ ਰਵੀ ਕੁਮਾਰ",
    phone: "ਫ਼ੋਨ ਨੰਬਰ",
    phonePlaceholder: "ਜਿਵੇਂ 9876543210",
    location: "ਟਿਕਾਣਾ / ਪਿੰਡ / ਸ਼ਹਿਰ",
    locationPlaceholder: "ਜਿਵੇਂ ਅੰਮ੍ਰਿਤਸਰ, ਪੰਜਾਬ",
    password: "ਪਾਸਵਰਡ",
    passwordPlaceholder: "ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ",
    selectRole: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
    createAccount: "ਖਾਤਾ ਬਣਾਓ",
    alreadyHave: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?",
    signIn: "ਸਾਈਨ ਇਨ",
    noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    signUp: "ਸਾਈਨ ਅੱਪ",
  },
};

const LANG_FLAGS = { en: "🇬🇧", hi: "🇮🇳", pa: "🏳️" };
const LANG_LABELS = { en: "English", hi: "हिंदी", pa: "ਪੰਜਾਬੀ" };

function validateStep1(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required";
  if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) {
    errs.phone = "Enter a valid 10-digit phone number";
  }
  if (!form.location.trim()) errs.location = "Location is required";
  if (form.password.length < 6) errs.password = "Min. 6 characters";
  if (!form.role) errs.role = "Please select a role";
  return errs;
}

function validateProfile(role, values) {
  const errs = {};

  if (role === "farmer") {
    if (!values.location?.trim()) errs.location = "Required";
    if (!/^\d{6}$/.test(String(values.pincode || ""))) errs.pincode = "Enter valid 6-digit pincode";
    if (values.landSize === "" || values.landSize === undefined) errs.landSize = "Required";
  }

  if (role === "aggregator") {
    if (!values.operatingArea?.trim()) errs.operatingArea = "Required";
    if (!/^\d{6}$/.test(String(values.pincode || ""))) errs.pincode = "Enter valid 6-digit pincode";
    if (values.storageCapacity === "" || values.storageCapacity === undefined) errs.storageCapacity = "Required";
    if (!values.vehicleType?.trim()) errs.vehicleType = "Required";
    if (!values.experience) errs.experience = "Required";
  }

  if (role === "industry") {
    if (!values.companyName?.trim()) errs.companyName = "Required";
    if (!values.industryType?.trim()) errs.industryType = "Required";
    if (!values.location?.trim()) errs.location = "Required";
    if (!/^\d{6}$/.test(String(values.pincode || ""))) errs.pincode = "Enter valid 6-digit pincode";
  }

  return errs;
}

export default function AuthPage() {
  const [lang, setLang] = useState("en");
  const [step, setStep] = useState("signup");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    password: "",
    role: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [profileValues, setProfileValues] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [signupError, setSignupError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [signinError, setSigninError] = useState("");

  const t = translations[lang];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    setSignupError("");
    setSigninError("");
  };

  const handleRoleChange = (val) => {
    setForm((prev) => ({ ...prev, role: val }));
    setFormErrors((prev) => ({ ...prev, role: undefined }));
    setProfileValues({});
    setSignupError("");
    setSigninError("");
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const errs = validateStep1(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    try {
      setSignupError("");

      const res = await api.post("/auth/register", {
        name: form.name,
        mobile: form.phone,
        location: form.location,
        password: form.password,
        role: form.role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setStep("profile");
    } catch (error) {
      setSignupError(error.response?.data?.message || "Registration failed");
    }
  };

  const handleProfileChange = (name, value) => {
    setProfileValues((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    setProfileError("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const errs = validateProfile(form.role, profileValues);
    if (Object.keys(errs).length) {
      setProfileErrors(errs);
      return;
    }

    try {
      setProfileError("");

      const token = localStorage.getItem("token");

      const res = await api.patch("/auth/complete-profile", profileValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "farmer") {
        window.location.href = "/farmer-dashboard";
      } else if (res.data.user.role === "aggregator") {
        window.location.href = "/aggregator-dashboard";
      } else {
        window.location.href = "/industry-dashboard";
      }
    } catch (error) {
      setProfileError(error.response?.data?.message || "Profile update failed");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.password.trim()) errs.password = "Password is required";
    if (!form.role) errs.role = "Please select a role";

    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setSigninError("");

      const res = await api.post("/auth/login", {
        mobile: form.phone,
        password: form.password,
        role: form.role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (!res.data.user.profileComplete) {
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
    } catch (error) {
      setSigninError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="agri-root">
      <div className="agri-bg" />

      <div className="lang-bar">
        {["en", "hi", "pa"].map((l) => (
          <button
            key={l}
            type="button"
            className={`lang-btn${lang === l ? " active" : ""}`}
            onClick={() => setLang(l)}
          >
            <span className="lang-flag">{LANG_FLAGS[l]}</span>
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="agri-card">
        <div className="agri-logo">
          <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
            <path d="M17 8C8 10 5.9 16.17 3.82 19.6A10.94 10.94 0 012 12C2 6.48 6.48 2 12 2c2.3 0 4.42.74 6.14 1.99L17 8z" />
            <path d="M17 8c0 5-3.5 9.19-8 10.36V18c0-4 3-7.93 8-10z" />
          </svg>
        </div>

        {step === "signup" && (
          <>
            <h1 className="agri-title">{t.join}</h1>
            <p className="agri-sub">{t.subtitle}</p>

            <form className="agri-form" onSubmit={handleCreateAccount} noValidate>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t.fullName}</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.namePlaceholder}
                  />
                  {formErrors.name && <span className="field-err">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label>📞 {t.phone}</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                  />
                  {formErrors.phone && <span className="field-err">{formErrors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>📍 {t.location}</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder={t.locationPlaceholder}
                  />
                  {formErrors.location && <span className="field-err">{formErrors.location}</span>}
                </div>

                <div className="form-group">
                  <label>{t.password}</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={t.passwordPlaceholder}
                  />
                  {formErrors.password && <span className="field-err">{formErrors.password}</span>}
                </div>
              </div>

              <div className="role-section">
                <p className="role-label">{t.selectRole}</p>
                <RoleSelector value={form.role} onChange={handleRoleChange} />
                {formErrors.role && <span className="field-err">{formErrors.role}</span>}
              </div>

              {signupError && <div className="server-error">{signupError}</div>}

              <button type="submit" className="cta-btn">
                {t.createAccount}
              </button>
            </form>

            <p className="switch-text">
              {t.alreadyHave}{" "}
              <button type="button" className="link-btn" onClick={() => setStep("signin")}>
                {t.signIn}
              </button>
            </p>
          </>
        )}

        {step === "profile" && (
          <>
            <h1 className="agri-title">Complete Your Profile</h1>
            <p className="agri-sub">Just a few more details to finish setup.</p>

            {profileError && <div className="server-error">{profileError}</div>}

            <ProfileCompletionForm
              role={form.role}
              values={profileValues}
              errors={profileErrors}
              onChange={handleProfileChange}
              onSubmit={handleProfileSubmit}
              onBack={() => setStep("signup")}
            />
          </>
        )}

        {step === "signin" && (
          <>
            <h1 className="agri-title">{t.signInTitle}</h1>
            <p className="agri-sub">{t.signInSubtitle}</p>

            <form className="agri-form" onSubmit={handleSignIn} noValidate>
              <div className="form-grid single">
                <div className="form-group full">
                  <label>📞 {t.phone}</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                  />
                  {formErrors.phone && <span className="field-err">{formErrors.phone}</span>}
                </div>

                <div className="form-group full">
                  <label>{t.password}</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={t.passwordPlaceholder}
                  />
                  {formErrors.password && <span className="field-err">{formErrors.password}</span>}
                </div>
              </div>

              <div className="role-section">
                <p className="role-label">{t.selectRole}</p>
                <RoleSelector value={form.role} onChange={handleRoleChange} />
                {formErrors.role && <span className="field-err">{formErrors.role}</span>}
              </div>

              {signinError && <div className="server-error">{signinError}</div>}

              <button type="submit" className="cta-btn">
                {t.signIn}
              </button>
            </form>

            <p className="switch-text">
              {t.noAccount}{" "}
              <button type="button" className="link-btn" onClick={() => setStep("signup")}>
                {t.signUp}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}