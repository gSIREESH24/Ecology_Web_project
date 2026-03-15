import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ScienceIcon from "@mui/icons-material/Science";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../../NavBar/navbar";
import { useState } from "react";

export default function AnalysePage() {

  const [selectedCrop, setSelectedCrop] = useState(null);

  const [cropTypes, setCropTypes] = useState([
    "🌾 Wheat",
    "🌾 Rice / Paddy",
    "🌿 Sugarcane",
    "🌽 Maize / Corn",
    "🧵 Cotton"
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newCropType, setNewCropType] = useState("");

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCropType("");
  };

  const handleAddCrop = () => {
    if (newCropType.trim()) {
      setCropTypes([...cropTypes, newCropType]);
      setSelectedCrop(newCropType);
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh" }}>

      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>

        <Grid container spacing={3} alignItems="stretch" justifyContent="center">

          <Grid item xs={12} md={6}>

            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 0 20px rgba(76,175,80,0.4), 0 0 40px rgba(76,175,80,0.2)",
                display: "flex",
                flexDirection: "column"
              }}
            >

              <CardContent sx={{ flexGrow: 1 }}>

                <Typography fontWeight="bold">
                  📷 Upload Stubble Photo
                </Typography>

                <Box
                  sx={{
                    border: "2px dashed #d0d0d0",
                    borderRadius: 3,
                    p: 5,
                    textAlign: "center",
                    mt: 2,
                    cursor: "pointer",
                    "&:hover": { background: "#f2f7f3" }
                  }}
                >

                  <CameraAltIcon sx={{ fontSize: 40, color: "#2e7d32" }} />

                  <Typography mt={1} fontWeight="bold">
                    Tap to upload photo
                  </Typography>

                  <Typography variant="body2" color="gray">
                    or drag & drop your field photo here
                  </Typography>

                </Box>

                <Typography mt={3} mb={1} fontWeight="bold">
                  Crop Type
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>

                  {cropTypes.map((crop) => (
                    <Button
                      key={crop}
                      onClick={() => handleCropSelect(crop)}
                      variant={selectedCrop === crop ? "contained" : "outlined"}
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        background:
                          selectedCrop === crop ? "#4caf50" : "transparent",
                        color:
                          selectedCrop === crop ? "white" : "#4caf50",
                        border: "2px solid #4caf50"
                      }}
                    >
                      {crop}
                    </Button>
                  ))}

                  <Button
                    onClick={handleOpenDialog}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      color: "#7fa899",
                      border: "2px solid #7fa899"
                    }}
                  >
                    Add
                  </Button>

                </Box>

                <Typography mt={3} mb={1} fontWeight="bold">
                  Field Area
                </Typography>

                <TextField placeholder="e.g. 2.5 Acres" fullWidth />

                <Button
                  fullWidth
                  startIcon={<ScienceIcon />}
                  sx={{
                    mt: 3,
                    background: "#7fa899",
                    color: "white",
                    borderRadius: 3,
                    p: 1.2,
                    "&:hover": { background: "#6b9487" }
                  }}
                >
                  Analyse with AI
                </Button>

              </CardContent>

            </Card>

          </Grid>

          <Grid item xs={12} md={6}>

            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 0 20px rgba(76,175,80,0.4), 0 0 40px rgba(76,175,80,0.2)",
                display: "flex"
              }}
            >

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center"
                }}
              >

                <ScienceIcon sx={{ fontSize: 60, color: "#a5c1b5" }} />

                <Typography mt={2} fontWeight="bold">
                  No analysis yet
                </Typography>

                <Typography color="gray">
                  Upload a photo and submit to get AI-powered biomass analysis.
                </Typography>

              </CardContent>

            </Card>

          </Grid>

        </Grid>

      </Container>


      <Dialog open={openDialog} onClose={handleCloseDialog}>

        <DialogTitle>Add New Crop Type</DialogTitle>

        <DialogContent>

          <TextField
            autoFocus
            margin="dense"
            label="Crop Type (e.g., 🥕 Carrot)"
            fullWidth
            value={newCropType}
            onChange={(e) => setNewCropType(e.target.value)}
            sx={{ mt: 2 }}
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>

          <Button
            onClick={handleAddCrop}
            variant="contained"
            sx={{ background: "#4caf50" }}
          >
            Add
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}