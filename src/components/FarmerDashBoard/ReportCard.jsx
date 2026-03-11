import { Card, Typography, Box } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function ReportCard() {
  return (
    <Card
      sx={{
        border: "2px dashed #8bc34a",
        borderRadius: 4,
        p: 5,
        textAlign: "center",
        background: "#fafafa"
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