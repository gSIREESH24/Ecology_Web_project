import { Card, CardContent, Typography, Box } from "@mui/material";
import { Wallet, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CashCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          background: "linear-gradient(135deg, #0f3424 0%, #236940 100%)",
          color: "white",
          borderRadius: "28px",
          p: { xs: 2, md: 3 },
          height: "100%",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(35, 105, 64, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 30px 50px rgba(35, 105, 64, 0.35)",
          }
        }}
      >

        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)', borderRadius: '50%', filter: 'blur(15px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 100%)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

        <CardContent sx={{ position: "relative", zIndex: 1, padding: "0 !important" }}>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ p: 1.2, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '14px', display: 'flex' }}>
                <Wallet size={24} color="#a0e1b9" />
              </Box>
              <Typography variant="h6" fontWeight="700" sx={{ letterSpacing: '0.5px' }}>
                Virtual Wallet
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.8, borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
              <TrendingUp size={16} color="#a0e1b9" />
              <Typography variant="body2" fontWeight="bold">+12%</Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="baseline" gap={1} mt={1}>
            <Typography variant="h2" sx={{ fontWeight: "900", background: "linear-gradient(90deg, #ffffff, #a0e1b9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: '-1.5px' }}>
              ₹1,500
            </Typography>
            <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>.00</Typography>
          </Box>

          <Box display="flex" alignItems="flex-start" gap={1.5} mt={4} sx={{ background: 'rgba(0,0,0,0.15)', p: 2, borderRadius: '18px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Sparkles size={20} color="#FFD700" style={{ marginTop: '2px', flexShrink: 0 }} />
            <Typography variant="body2" sx={{ lineHeight: 1.6, opacity: 0.95, fontSize: '0.95rem' }}>
              You earn virtual cash when your field is analyzed. Use this against premium fertilizer purchases or eco-friendly equipment.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}