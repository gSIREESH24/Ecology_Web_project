import { useState } from "react";
import "./login.css";
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
    phonePlaceholder: "e.g. +91 98765 43210",
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
    phonePlaceholder: "जैसे +91 98765 43210",
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
    phonePlaceholder: "ਜਿਵੇਂ +91 98765 43210",
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
  if (!/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, "")))
    errs.phone = "Enter a valid phone number";
  if (!form.location.trim()) errs.location = "Location is required";
  if (form.password.length < 6) errs.password = "Min. 6 characters";
  if (!form.role) errs.role = "Please select a role";
  return errs;
}

function validateProfile(role, values) {
  const errs = {};
  if (role === "farmer") {
    if (!values.location?.trim()) errs.location = "Required";
    if (!/^\d{6}$/.test(values.pincode)) errs.pincode = "Enter valid 6-digit pincode";
  }
  if (role === "aggregator") {
    if (!values.operatingArea?.trim()) errs.operatingArea = "Required";
    if (!/^\d{6}$/.test(values.pincode)) errs.pincode = "Enter valid 6-digit pincode";
  }
  if (role === "industry") {
    if (!values.companyName?.trim()) errs.companyName = "Required";
    if (!values.location?.trim()) errs.location = "Required";
    if (!/^\d{6}$/.test(values.pincode)) errs.pincode = "Enter valid 6-digit pincode";
  }
  return errs;
}

export default function LoginPage() {
  const [lang, setLang] = useState("en");
  // steps: "signup" | "profile" | "signin"
  const [step, setStep] = useState("signup");

  const [form, setForm] = useState({
    name: "", phone: "", location: "", password: "", role: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [profileValues, setProfileValues] = useState({});
  const [profileErrors, setProfileErrors] = useState({});

  const t = translations[lang];

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const handleRoleChange = (val) => {
    setForm((f) => ({ ...f, role: val }));
    setFormErrors((er) => ({ ...er, role: undefined }));
    setProfileValues({});
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const errs = validateStep1(form);
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setStep("profile"); // ← this is what was missing
  };

  const handleProfileChange = (name, value) => {
    setProfileValues((v) => ({ ...v, [name]: value }));
    setProfileErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const errs = validateProfile(form.role, profileValues);
    if (Object.keys(errs).length) {
      setProfileErrors(errs);
      return;
    }
    // ✅ Wire your auth/API call here
    console.log("Final payload:", { ...form, profile: profileValues });
    alert("Account created! 🎉");
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    // Wire your sign-in API here
    console.log("Sign in:", { phone: form.phone, password: form.password });
  };

  return (
    <div className="agri-root">
      <div className="agri-bg" />

      {/* Language switcher */}
      <div className="lang-bar">
        {["en", "hi", "pa"].map((l) => (
          <button
            key={l}
            className={`lang-btn${lang === l ? " active" : ""}`}
            onClick={() => setLang(l)}
          >
            <span className="lang-flag">{LANG_FLAGS[l]}</span>
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="agri-card">
        {/* Logo */}
        <div className="agri-logo">
          <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
            <path d="M17 8C8 10 5.9 16.17 3.82 19.6A10.94 10.94 0 012 12C2 6.48 6.48 2 12 2c2.3 0 4.42.74 6.14 1.99L17 8z" />
            <path d="M17 8c0 5-3.5 9.19-8 10.36V18c0-4 3-7.93 8-10z" />
          </svg>
        </div>

        {/* ── SIGNUP ── */}
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

              <button type="submit" className="cta-btn">{t.createAccount}</button>
            </form>

            <p className="switch-text">
              {t.alreadyHave}{" "}
              <button className="link-btn" onClick={() => setStep("signin")}>{t.signIn}</button>
            </p>
          </>
        )}

        {/* ── PROFILE COMPLETION ── */}
        {step === "profile" && (
          <>
            <h1 className="agri-title">Complete Your Profile</h1>
            <p className="agri-sub">Just a few more details to finish setup.</p>

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

        {/* ── SIGN IN ── */}
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
                </div>
              </div>
              <button type="submit" className="cta-btn">{t.signIn}</button>
            </form>

            <p className="switch-text">
              {t.noAccount}{" "}
              <button className="link-btn" onClick={() => setStep("signup")}>{t.signUp}</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}