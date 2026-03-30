import { Card, Typography, Box } from "@mui/material";
import { Camera, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ReportCard() {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/analysis");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        onClick={handleCardClick}
        sx={{
          border: "1px solid rgba(139, 195, 74, 0.4)",
          borderRadius: "28px",
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: "center",
          height: '100%',
          background: "linear-gradient(145deg, #ffffff 0%, #f4fbef 100%)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(139, 195, 74, 0.08)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          "&:hover": {
            border: "1px solid rgba(139, 195, 74, 0.8)",
            transform: "translateY(-6px)",
            boxShadow: "0 20px 40px rgba(139, 195, 74, 0.18)",
            "& .icon-box": {
              transform: "scale(1.1) rotate(5deg)",
              boxShadow: "0 15px 25px rgba(76, 175, 80, 0.3)"
            },
            "& .arrow-icon": {
              transform: "translateX(6px)"
            }
          }
        }}
      >
        <Box sx={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,195,74,0.15) 1px, transparent 0)', 
          backgroundSize: '24px 24px', opacity: 0.6, pointerEvents: 'none' 
        }} />

        <Box display="flex" justifyContent="center" width="100%" position="absolute" top={20} left={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, background: 'rgba(76, 175, 80, 0.12)', color: '#2e7d32', px: 2, py: 0.6, borderRadius: '20px', border: '1px solid rgba(76,175,80,0.2)' }}>
            <ShieldCheck size={16} />
            <Typography variant="caption" fontWeight="800">AI Powered Analysis</Typography>
          </Box>
        </Box>

        <Box 
          className="icon-box"
          sx={{ 
            mb: 3, mt: 4, p: 2.5, 
            background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)", 
            borderRadius: "22px",
            boxShadow: "0 10px 20px rgba(76, 175, 80, 0.2)",
            transition: "all 0.4s ease",
            zIndex: 1
          }}
        >
          <Camera size={44} color="white" strokeWidth={1.5} />
        </Box>

        <Typography variant="h5" fontWeight="800" sx={{ color: '#1a3b2b', mb: 1.5, zIndex: 1, letterSpacing: '-0.5px' }}>
          Report Stubble Status
        </Typography>

        <Typography variant="body1" sx={{ color: "#546e7a", mb: 4, maxWidth: '280px', lineHeight: 1.6, zIndex: 1 }}>
          Take a photo of your field to instantly evaluate conditions and earn rewards.
        </Typography>

        <Box 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32', fontWeight: '800', zIndex: 1, fontSize: '1.05rem', background: 'rgba(76,175,80,0.1)', px: 3, py: 1.2, borderRadius: '30px' }}
        >
          Start Upload 
          <ArrowRight className="arrow-icon" size={20} style={{ transition: "transform 0.3s ease", strokeWidth: 3 }} />
        </Box>
      </Card>
    </motion.div>
  );
}