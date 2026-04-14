import { createContext, useState } from "react";

export const ProfileContext = createContext();

export default function ProfileProvider({ children }) {
  const [showProfile, setShowProfile] = useState(false);

  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);

  return (
    <ProfileContext.Provider value={{ showProfile, openProfile, closeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
