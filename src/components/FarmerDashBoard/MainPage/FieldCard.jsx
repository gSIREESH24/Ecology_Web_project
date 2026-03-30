import { Box, Card, Typography, LinearProgress } from "@mui/material";
import { Sprout, MapPin, Droplet } from "lucide-react";
import { motion } from "framer-motion";

export default function FieldCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card sx={{ 
        borderRadius: "28px", 
        p: 3, 
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        transition: "all 0.4s ease",
        background: "#ffffff",
        "&:hover": {
          boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
          transform: "translateY(-4px)",
          border: "1px solid rgba(46, 125, 50, 0.15)"
        }
      }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3.5} alignItems="center">
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
              alt="field"
              style={{ borderRadius: "24px", width: "130px", height: "130px", objectFit: "cover", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
            />
            <Box sx={{ position: 'absolute', bottom: -12, right: -12, background: 'white', borderRadius: '50%', p: 0.8, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <Box sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', borderRadius: '50%', p: 1.2, display: 'flex', color: 'white' }}>
                <Sprout size={18} />
              </Box>
            </Box>
          </Box>

          <Box flex={1} width="100%">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
              <Box>
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <Typography variant="h5" fontWeight="900" sx={{ color: '#1a3b2b', letterSpacing: '-0.5px' }}>
                    Golden Wheat Field
                  </Typography>
                  <Box
                    sx={{
                      background: "rgba(46, 125, 50, 0.08)",
                      color: "#2e7d32",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: 12,
                      fontWeight: "800",
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      border: '1px solid rgba(46,125,50,0.15)'
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50' }} />
                    CLEARED
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2.5} color="text.secondary">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <MapPin size={16} color="#78909c" />
                    <Typography variant="body2" fontWeight="600">Punjab, Area 51</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Droplet size={16} color="#2196f3" />
                    <Typography variant="body2" fontWeight="600">5.5 Tons Produced</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'right', background: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)', px: 2, py: 1.5, borderRadius: '20px', border: '1px solid rgba(139,195,74,0.3)', boxShadow: '0 4px 10px rgba(139,195,74,0.1)' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="800">REWARD</Typography>
                <Typography variant="h5" sx={{ color: "#2e7d32", fontWeight: "900", lineHeight: 1, mt: 0.5 }}>
                  ₹ 500
                </Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>ECO-FRIENDLY SCORE</Typography>
                <Typography variant="subtitle2" fontWeight="900" color="#2e7d32">92%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={92} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5, 
                  background: 'rgba(0,0,0,0.04)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #8bc34a 0%, #4caf50 100%)',
                    borderRadius: 5
                  }
                }} 
              />
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}