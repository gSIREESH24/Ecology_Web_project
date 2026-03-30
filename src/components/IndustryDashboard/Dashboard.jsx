import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";

export default function IndustryDashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 5,
        background: "linear-gradient(135deg, #f7fbf5 0%, #edf6fb 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#123140", mb: 1 }}>
          Industry Dashboard
        </Typography>
        <Typography sx={{ color: "#66717d", mb: 4 }}>
          View sourcing needs, company demand, and regional operations in a role-specific dashboard.
        </Typography>

        <Grid container spacing={3}>
          {[
            ["Company Overview", "Keep company and industry details connected to your workflow."],
            ["Demand Planning", "Track material intake expectations and supply readiness."],
            ["Location Insights", "Work with location-based operations and sourcing visibility."],
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
