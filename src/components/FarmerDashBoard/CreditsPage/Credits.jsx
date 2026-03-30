import { Box, Typography, Container, Grid, Card, CardContent, CssBaseline } from "@mui/material";
import Navbar from "../NavBar/navbar";
import { motion } from "framer-motion";
import { WalletCards, Coins, Award, CheckCircle2, Factory, Sprout } from "lucide-react";

export default function CreditsPage() {
  const completedTasks = [
    {
      id: 1,
      name: "Wheat Field Harvest",
      date: "Oct 12, 2025",
      type: "Eco-Friendly Clearing",
      credits: 500,
      icon: <Sprout size={24} color="#4caf50" />,
      tagColor: "#e8f5e9",
      tagText: "#2e7d32"
    },
    {
      id: 2,
      name: "Paddy Biomass Recycling",
      date: "Sep 28, 2025",
      type: "Biomass Submitted",
      credits: 750,
      icon: <Factory size={24} color="#ff9800" />,
      tagColor: "#fff3e0",
      tagText: "#e65100"
    },
    {
      id: 3,
      name: "Sustainable Farming Bonus",
      date: "Sep 01, 2025",
      type: "Achievement",
      credits: 250,
      icon: <Award size={24} color="#2196f3" />,
      tagColor: "#e3f2fd",
      tagText: "#1565c0"
    }
  ];

  const totalCredits = completedTasks.reduce((acc, task) => acc + task.credits, 0);

  return (
    <Box sx={{ 
      background: "radial-gradient(circle at 50% 0%, rgb(245, 252, 248) 0%, rgb(235, 246, 240) 100%)", 
      minHeight: "100vh", position: 'relative', overflowX: 'hidden'
    }}>
      <CssBaseline />

      <Box sx={{ position:'absolute', top:-150, left:-150, width:600, height:600, background:'radial-gradient(circle, rgba(255,193,7,0.05) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box mb={5} textAlign="center">
              <Typography variant="h3" fontWeight="900" sx={{ color: '#1a3b2b', letterSpacing: '-1px' }}>
                Your Eco-<Box component="span" sx={{ background: 'linear-gradient(90deg, #fbc02d, #f57f17)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Credits</Box>
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            
            <Grid item xs={12} md={4}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card sx={{ 
                  borderRadius: "28px", 
                  background: "linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)",
                  color: "white",
                  p: { xs: 2, md: 3 },
                  boxShadow: "0 20px 50px rgba(27, 94, 32, 0.3)",
                  position: "sticky",
                  top: "30px",
                  overflow: "visible",
                  "&:hover": { boxShadow: "0 25px 60px rgba(27, 94, 32, 0.4)", transform: "translateY(-4px)" },
                  transition: "all 0.3s ease"
                }}>
                  <Box sx={{ position:'absolute', top: -30, right: -20, opacity: 0.2 }}>
                    <Coins size={140} />
                  </Box>
                  <CardContent sx={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                    
                    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                      <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.15)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                        <WalletCards size={28} color="#fff" />
                      </Box>
                      <Typography variant="h6" fontWeight="800">Available Balance</Typography>
                    </Box>

                    <Box display="flex" alignItems="baseline" gap={1.5} mb={4}>
                      <Typography variant="h2" sx={{ fontWeight: "900", background: "linear-gradient(90deg, #fff, #ffe082)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: '-2px' }}>
                        ₹{totalCredits.toLocaleString()}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: "bold" }}>.00</Typography>
                    </Box>

                    <Typography variant="body2" sx={{ lineHeight: 1.6, background: "rgba(0,0,0,0.15)", p: 2, borderRadius: "16px", backdropFilter: "blur(5px)" }}>
                      You have earned enough credits to unlock a <strong>15% discount</strong> on your next eco-fertilizer purchase. Keep scoring!
                    </Typography>

                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="column" gap={3}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Typography variant="h5" fontWeight="800" sx={{ color: '#1a3b2b', mb: 1 }}>
                    Completed Activities
                  </Typography>
                </motion.div>

                {completedTasks.map((task, index) => (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}>
                    <Card sx={{ 
                      borderRadius: "24px", 
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
                      display: "flex", 
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: { xs: 2.5, sm: 3 },
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: "0 15px 40px rgba(76, 175, 80, 0.1)", transform: "translateX(6px)" }
                    }}>
                      <Box display="flex" alignItems="center" gap={3}>
                        <Box sx={{ p: 2, background: task.tagColor, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {task.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="800" sx={{ color: '#1a3b2b', mb: 0.5, letterSpacing: '-0.5px' }}>
                            {task.name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mt={1}>
                            <Typography variant="body2" fontWeight="600" sx={{ color: task.tagText, background: task.tagColor, px: 1.5, py: 0.5, borderRadius: '12px', fontSize: '0.75rem' }}>
                              {task.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                              {task.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box textAlign="right">
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <CheckCircle2 size={16} color="#4caf50" />
                          <Typography variant="caption" fontWeight="800" color="#4caf50">CREDITED</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight="900" sx={{ color: '#2e7d32' }}>
                          +₹{task.credits}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Grid>

          </Grid>

        </Container>
      </Box>
    </Box>
  );
}
