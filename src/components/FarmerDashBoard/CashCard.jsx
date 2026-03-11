import { Card, CardContent, Typography } from "@mui/material";

export default function CashCard() {
  return (
    <Card
      sx={{
        background: "#1f7a3f",
        color: "white",
        borderRadius: 4,
        p: 2,
        boxShadow: 3
      }}
    >
      <CardContent>

        <Typography variant="h6">
          Total Virtual Cash Earned
        </Typography>

        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mt: 2 }}
        >
          ₹1,500
        </Typography>

        <Typography sx={{ mt: 2 }}>
          You earn virtual cash as soon as your field is analyzed.
          Use this against fertilizer purchases.
        </Typography>

      </CardContent>
    </Card>
  );
}