import { Card, Typography, Box } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";

export default function ReportCard() {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/analysis");
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        border: "2px dashed #8bc34a",
        borderRadius: 4,
        p: 5,
        textAlign: "center",
        background: "#fafafa",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "#f0f5e8",
          borderColor: "#4caf50",
          boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)"
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
        <CameraAltIcon sx={{ fontSize: 45, color: "#4caf50" }} />
      </Box>

      <Typography variant="h6" fontWeight="bold">
        Report New Stubble
      </Typography>

      <Typography color="text.secondary">
        Take a photo of your field for auto-analysis
      </Typography>

    </Card>
  );
}