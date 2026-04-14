import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AUTH_MODE_KEY = "authMode";
const USERS_KEY = "ecostubbleUsers";
const SESSION_KEY = "ecostubbleSession";

export const ROLE_PROFILE_FIELDS = {
  farmer: ["location", "pincode", "landSize"],
  aggregator: ["operatingArea", "pincode", "storageCapacity", "vehicleType", "experience"],
  industry: ["companyName", "industryType", "location", "pincode"],
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getUsers = () => safeParse(localStorage.getItem(USERS_KEY), []);
const getSession = () => safeParse(sessionStorage.getItem(SESSION_KEY), null);

const normalizeRole = (role = "") => role.trim().toLowerCase();
const isEmail = (value = "") => /\S+@\S+\.\S+/.test(value.trim());
const isPhone = (value = "") => /^[6-9]\d{9}$/.test(value.trim());

const isProfileComplete = (role, profile = {}) => {
  const fields = ROLE_PROFILE_FIELDS[normalizeRole(role)] || [];
  return fields.every((field) => `${profile[field] ?? ""}`.trim() !== "");
};

const buildUser = ({ name, identifier, password, role }) => {
  const trimmedIdentifier = identifier.trim();

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    password,
    role: normalizeRole(role),
    email: isEmail(trimmedIdentifier) ? trimmedIdentifier.toLowerCase() : "",
    phone: isPhone(trimmedIdentifier) ? trimmedIdentifier : "",
    profile: {},
    profileComplete: false,
  };
};

export const AuthProvider = ({ children }) => {
  const [side, setSide] = useState(() => localStorage.getItem(AUTH_MODE_KEY) || "signin");
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    localStorage.setItem(AUTH_MODE_KEY, side);
  }, [side]);

  useEffect(() => {
    if (session) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem("userRole", session.role);
      localStorage.setItem("userName", session.name);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
    }
  }, [session]);

  const register = ({ name, identifier, password, role }) => {
    const users = getUsers();
    const normalizedIdentifier = identifier.trim().toLowerCase();

    const duplicate = users.find((user) => {
      const matchesEmail = user.email && user.email.toLowerCase() === normalizedIdentifier;
      const matchesPhone = user.phone && user.phone === identifier.trim();
      return matchesEmail || matchesPhone;
    });

    if (duplicate) {
      return { ok: false, message: "An account already exists with this phone or email." };
    }

    const newUser = buildUser({ name, identifier, password, role });
    const nextSession = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      phone: newUser.phone,
      profile: {},
      profileComplete: false,
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    setSession(nextSession);

    return { ok: true, user: nextSession };
  };

  const login = ({ identifier, password, role }) => {
    const users = getUsers();
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedRole = normalizeRole(role);

    const matchedUser = users.find((user) => {
      const matchesEmail = user.email && user.email.toLowerCase() === normalizedIdentifier;
      const matchesPhone = user.phone && user.phone === identifier.trim();
      const matchesName = user.name && user.name.trim().toLowerCase() === normalizedIdentifier;
      const matchesRole = normalizeRole(user.role) === normalizedRole;
      return (matchesEmail || matchesPhone || matchesName) && user.password === password && matchesRole;
    });

    if (!matchedUser) {
      return { ok: false, message: "Incorrect details or selected role." };
    }

    const nextSession = {
      id: matchedUser.id,
      name: matchedUser.name,
      role: matchedUser.role,
      email: matchedUser.email,
      phone: matchedUser.phone,
      profile: matchedUser.profile || {},
      profileComplete: Boolean(matchedUser.profileComplete),
    };

    setSession(nextSession);
    return { ok: true, user: nextSession };
  };

  const completeProfile = (profileData) => {
    if (!session) {
      return { ok: false, message: "No active user session found." };
    }

    const users = getUsers();
    const nextUsers = users.map((user) => {
      if (user.id !== session.id) return user;

      const nextProfile = { ...(user.profile || {}), ...profileData };
      return {
        ...user,
        profile: nextProfile,
        profileComplete: isProfileComplete(user.role, nextProfile),
      };
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

    const updatedUser = nextUsers.find((user) => user.id === session.id);
    const nextSession = {
      ...session,
      profile: updatedUser?.profile || {},
      profileComplete: Boolean(updatedUser?.profileComplete),
    };

    setSession(nextSession);
    return { ok: true, user: nextSession };
  };

  const logout = () => {
    setSession(null);
    setSide("signin");
  };

  const value = useMemo(
    () => ({
      side,
      setSide,
      session,
      isAuthenticated: Boolean(session),
      register,
      login,
      completeProfile,
      logout,
    }),
    [session, side]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export const useAuthSide = () => useContext(AuthContext);
