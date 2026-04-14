import { memo } from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

const PROFILE_FIELDS = {
  farmer: [
    { name: "location", label: "Location", placeholder: "Village / district" },
    { name: "pincode", label: "Pincode", placeholder: "6-digit pincode" },
    {
      name: "landSize",
      label: "Land size in acres",
      type: "number",
      inputProps: { min: 0, step: 0.1 },
    },
  ],
  aggregator: [
    { name: "operatingArea", label: "Operating area", placeholder: "District / region served" },
    { name: "pincode", label: "Pincode", placeholder: "Primary area pincode" },
    {
      name: "storageCapacity",
      label: "Storage capacity (tons)",
      type: "number",
      inputProps: { min: 0, step: 1 },
    },
    { name: "vehicleType", label: "Vehicle type", placeholder: "Truck, mini truck, tractor..." },
    {
      name: "experience",
      label: "Experience",
      type: "select",
      options: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
    },
  ],
  industry: [
    { name: "companyName", label: "Company name" },
    { name: "industryType", label: "Industry type", placeholder: "Biofuel, packaging, power..." },
    { name: "location", label: "Location", placeholder: "City / district" },
    { name: "pincode", label: "Pincode", placeholder: "6-digit pincode" },
  ],
};

const ROLE_LABELS = {
  farmer: "Farmer",
  aggregator: "Aggregator",
  industry: "Industry",
};

const ProfileCompletionForm = memo(function ProfileCompletionForm({
  role,
  values,
  errors,
  onChange,
  onSubmit,
  onBack,
}) {
  const fields = PROFILE_FIELDS[role] || [];

  return (
    <form onSubmit={onSubmit} className="agri-form">
      <Typography className="signup-note" variant="body2">
        Complete your {ROLE_LABELS[role]} details to finish account setup. You can update the remaining details later from the profile page.
      </Typography>

      {fields.map((field) =>
        field.type === "select" ? (
          <TextField
            key={field.name}
            select
            fullWidth
            label={field.label}
            size="small"
            margin="normal"
            value={values[field.name] ?? ""}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            onChange={(event) => onChange(field.name, event.target.value)}
          >
            {field.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            size="small"
            margin="normal"
            type={field.type || "text"}
            value={values[field.name] ?? ""}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            inputProps={field.inputProps}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        )
      )}

      <Box className="profile-actions">
        <Button type="submit" variant="contained" className="submit-btn">
          Finish Setup
        </Button>
        <Button type="button" variant="text" className="switch-btn" onClick={onBack}>
          Back
        </Button>
      </Box>
    </form>
  );
});

export default ProfileCompletionForm;