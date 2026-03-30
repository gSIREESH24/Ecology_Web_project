import { Box, Typography, Grid } from "@mui/material";
import CashCard from "./CashCard";
import ReportCard from "./ReportCard";
import FieldCard from "./FieldCard";
import FarmLandMap from "./FarmLandMap";
import { motion } from "framer-motion";
import { Map, Activity } from "lucide-react";

export default function MainPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Box sx={{ p: { xs: 2, md: 4, lg: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary" fontWeight="600" mb={0.5}>
              {currentDate}
            </Typography>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#1a3b2b', letterSpacing: '-1px' }}>
              Welcome back, <Box component="span" sx={{ background: 'linear-gradient(90deg, #2e7d32, #689f38)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Farmer!</Box>
            </Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, background: 'white', p: 2, borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <Box sx={{ p: 1.5, background: '#fff9c4', borderRadius: '50%' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbc02d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>28°C</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">Sunny, Punjab</Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, width: '100%' }}>
        <Box sx={{ flex: { xs: '1 1 auto', sm: '2 1 0%' } }}>
          <CashCard />
        </Box>

        <Box sx={{ flex: { xs: '1 1 auto', sm: '1 1 0%' }, minWidth: { sm: '280px', lg: '350px' } }}>
          <ReportCard />
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Box display="flex" alignItems="center" gap={1.5} sx={{ mt: 6, mb: 3 }}>
          <Box sx={{ p: 1, background: '#e8f5e9', borderRadius: '12px', color: '#2e7d32' }}>
            <Map size={24} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "800", color:"#1a3b2b", letterSpacing: '-0.5px' }}>
            Farm Territory
          </Typography>
        </Box>
        
        <FarmLandMap />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box display="flex" alignItems="center" gap={1.5} sx={{ mt: 6, mb: 3 }}>
          <Box sx={{ p: 1, background: '#e3f2fd', borderRadius: '12px', color: '#1976d2' }}>
            <Activity size={24} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "800", color:"#1a3b2b", letterSpacing: '-0.5px' }}>
            Fields Activity
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FieldCard />
          </Grid>
        </Grid>
      </motion.div>

    </Box>
  );
}