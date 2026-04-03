import { Box, Button, memo } from "@mui/material";

const ROLE_OPTIONS = [
  { value: "farmer", label: "Farmer" },
  { value: "aggregator", label: "Aggregator" },
  { value: "industry", label: "Industry" },
];

const RoleSelector = memo(function RoleSelector({ value, onChange }) {
  return (
    <Box className="role-grid">
      {ROLE_OPTIONS.map((role) => (
        <Button
          key={role.value}
          type="button"
          variant={value === role.value ? "contained" : "outlined"}
          className={`role-pill ${value === role.value ? "selected" : ""}`}
          onClick={() => onChange(role.value)}
        >
          {role.label}
        </Button>
      ))}
    </Box>
  );
});

export default RoleSelector;
