import React from "react";

const ROLES = [
  { key: "farmer", label: "Farmer" },
  { key: "aggregator", label: "Aggregator" },
  { key: "industry", label: "Industry" },
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="role-selector">
      {ROLES.map((role) => (
        <button
          key={role.key}
          type="button"
          className={`role-btn ${value === role.key ? "active" : ""}`}
          onClick={() => onChange(role.key)}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}