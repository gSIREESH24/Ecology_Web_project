import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";

export default function AggregatorDashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 5,
        background: "linear-gradient(135deg, #f5fbff 0%, #eef7f6 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#123140", mb: 1 }}>
          Aggregator Dashboard
        </Typography>
        <Typography sx={{ color: "#66717d", mb: 4 }}>
          Manage sourcing, storage, transport, and partner coordination from one place.
        </Typography>

        <Grid container spacing={3}>
          {[
            ["Operating Reach", "Track your active regions and collection points."],
            ["Storage Capacity", "Monitor available tons and seasonal usage."],
            ["Vehicle Operations", "Keep transport type and movement readiness visible."],
          ].map(([title, text]) => (
            <Grid key={title} size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 5, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: "#66717d" }}>{text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
