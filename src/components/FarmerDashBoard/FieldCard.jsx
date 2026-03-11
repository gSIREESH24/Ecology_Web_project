import { Card, Grid, Typography, Box } from "@mui/material";

export default function FieldCard() {
  return (
    <Card sx={{ borderRadius: 4, p: 2 }}>

      <Grid container alignItems="center" spacing={2}>

        <Grid item>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
            alt="field"
            width="90"
            style={{ borderRadius: "12px" }}
          />
        </Grid>

        <Grid item xs>

          <Box display="flex" alignItems="center" gap={2}>

            <Typography variant="h6" fontWeight="bold">
              Wheat
            </Typography>

            <Box
              sx={{
                background: "#dff5e1",
                color: "#2e7d32",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: 12
              }}
            >
              COLLECTED
            </Box>

          </Box>

          <Typography color="text.secondary">
            Punjab Area • 5.5 Tons
          </Typography>

        </Grid>

        <Grid item>

          <Typography
            sx={{ color: "#2e7d32", fontWeight: "bold" }}
          >
            ₹ 500 Earned
          </Typography>

        </Grid>

      </Grid>

    </Card>
  );
}