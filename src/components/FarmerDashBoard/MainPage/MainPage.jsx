import { Box, Typography, Grid } from "@mui/material";
import CashCard from "./CashCard";
import ReportCard from "./ReportCard";
import FieldCard from "./FieldCard";
import FarmLandMap from "./FarmLandMap";

export default function MainPage() {
  return (
    <Box sx={{ p: 4 }}>

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <CashCard />
        </Grid>

        <Grid item xs={12} md={6}>
          <ReportCard />
        </Grid>

      </Grid>

      <Typography
        variant="h5"
        sx={{ mt: 5, mb: 3, fontWeight: "bold",color:"#2e7d32" }}
      >
        Your Farm Location
      </Typography>

      <FarmLandMap />

      <Typography
        variant="h5"
        sx={{ mt: 5, mb: 3, fontWeight: "bold",color:"#2e7d32" }}
      >
        My Fields Status
      </Typography>

      <FieldCard />

    </Box>
  );
}