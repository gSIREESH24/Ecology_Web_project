import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Divider
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

export default function Profile({ open, onClose }) {

  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "VK",
    phone: "+91 1234567890",
    gender: "Male",
    acresVerified: 15
  });

  const [formData, setFormData] = useState(profileData);

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "32px",
          background: "transparent",
          boxShadow: "0 25px 70px rgba(46, 125, 50, 0.2)"
        }
      }}
    >
      <DialogContent sx={{ p: 0, background: "transparent" }}>

        <Card
          sx={{
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: "none",
            backgroundColor: "white",
            border: "none",
            m: 0,
            p: 0
          }}
        >

          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 15,
              top: 15,
              zIndex: 10,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "white",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
              }
            }}
          >
            <CloseIcon sx={{ color: "#2e7d32", fontSize: 24 }} />
          </IconButton>

          <Box
            sx={{
              backgroundImage: "url('/assets/FarmLand.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              p: 4,
              textAlign: "center",
              color: "white",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: "250px",
              boxSizing: "border-box",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>

            <Avatar
              sx={{
                width: 110,
                height: 110,
                fontSize: "40px",
                margin: "auto",
                mb: 2,
                border: "4px solid white",
                background: "#1b5e20"
              }}
            >
              {profileData.name.charAt(0)}
            </Avatar>

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              {profileData.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ opacity: 0.9 }}
            >
              EcoStubble Farmer
            </Typography>

            <Box mt={2}>
              <Chip
                label={`${profileData.acresVerified} Acres Verified`}
                sx={{
                  background: "white",
                  color: "#2e7d32",
                  fontWeight: "bold"
                }}
              />
            </Box>

            </Box>

          </Box>

          <CardContent sx={{ p: 4 }}>

            {!isEditing ? (

              <>
                <Grid container spacing={3}>

                  <Grid item xs={12} sm={6}>
                    <ProfileBox
                      label="Phone Number"
                      value={profileData.phone}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <ProfileBox
                      label="Gender"
                      value={profileData.gender}
                    />
                  </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={handleEditClick}
                  sx={{
                    background:
                      "linear-gradient(135deg,#2e7d32,#43a047)",
                    fontWeight: "bold",
                    py: 1.5,
                    borderRadius: 3
                  }}
                >
                  Edit Profile
                </Button>

              </>

            ) : (

              <>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>

                      <InputLabel>Gender</InputLabel>

                      <Select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>

                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Acres Verified"
                      name="acresVerified"
                      type="number"
                      value={formData.acresVerified}
                      onChange={handleInputChange}
                    />
                  </Grid>

                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3
                  }}
                >

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    fullWidth
                    sx={{
                      background:
                        "linear-gradient(135deg,#2e7d32,#43a047)"
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    fullWidth
                    sx={{
                      borderColor: "#2e7d32",
                      color: "#2e7d32"
                    }}
                  >
                    Cancel
                  </Button>

                </Box>

              </>
            )}

          </CardContent>

        </Card>

      </DialogContent>
    </Dialog>
  );
}



function ProfileBox({ label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "16px",
        background: "#f8faf8",
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(46, 125, 50, 0.1)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "#2e7d32",
          fontWeight: "bold"
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h6"
        sx={{ mt: 1 }}
      >
        {value}
      </Typography>
    </Box>
  );
}