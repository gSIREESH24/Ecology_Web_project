import { Box, Typography, Grid } from "@mui/material";
import Navbar from "../NavBar/navbar";
import CashCard from "./CashCard";
import ReportCard from "./ReportCard";
import FieldCard from "./FieldCard";

export default function Dashboard() {
  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh" }}>

      <Navbar />

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
          sx={{ mt: 5, mb: 3, fontWeight: "bold" }}
        >
          My Fields Status
        </Typography>

        <FieldCard />

      </Box>

    </Box>
  );
}