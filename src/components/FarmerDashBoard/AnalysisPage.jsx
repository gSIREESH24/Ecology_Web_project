import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline
} from "@mui/material";
import { Camera, Image as ImageIcon, Zap, Plus, FlaskConical, MapPin, Loader2 } from "lucide-react";
import Navbar from "./navbar";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AnalysePage() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropTypes, setCropTypes] = useState([
    "🌾 Wheat",
    "🌾 Rice",
    "🌿 Sugarcane",
    "🌽 Maize",
    "🧵 Cotton"
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newCropType, setNewCropType] = useState("");
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCropType("");
  };

  const handleAddCrop = () => {
    if (newCropType.trim()) {
      setCropTypes([...cropTypes, `🌱 ${newCropType}`]);
      setSelectedCrop(`🌱 ${newCropType}`);
      handleCloseDialog();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <Box sx={{ 
      background: "radial-gradient(circle at 10% 20%, rgb(250, 252, 251) 0%, rgb(240, 246, 242) 90.2%)", 
      minHeight: "100vh", position: 'relative', overflowX: 'hidden'
    }}>
      <CssBaseline />
      
      <Box sx={{ position:'absolute', top:0, left:0, width:'100%', height:'500px', background:'linear-gradient(180deg, rgba(76, 175, 80, 0.04) 0%, rgba(255,255,255,0) 100%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position:'absolute', top:-100, right:-100, width:400, height:400, background:'radial-gradient(circle, rgba(139,195,74,0.08) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: { xs: 4, md: 5 }, pt: { xs: 2, md: 3 } }}>
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box mb={2} ml={1}>
              <Typography variant="h3" fontWeight="900" sx={{ color: '#1a3b2b', letterSpacing: '-1px' }}>
                AI Crop <Box component="span" sx={{ background: 'linear-gradient(90deg, #2e7d32, #689f38)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analysis</Box>
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 3, md: 4 }, width: "100%", alignItems: "stretch" }}>
            
            <motion.div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column" }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card sx={{ 
                flexGrow: 1,
                borderRadius: "28px", 
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "0 0 25px rgba(76, 175, 80, 0.2), 0 20px 50px rgba(0, 0, 0, 0.05)",
                display: "flex", 
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 0 35px rgba(76, 175, 80, 0.3), 0 25px 60px rgba(0, 0, 0, 0.08)" }
              }}>
                <CardContent sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box sx={{ p: 0.8, background: 'rgba(76, 175, 80, 0.1)', borderRadius: '12px', color: '#2e7d32' }}>
                      <Camera size={20} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" sx={{ color: '#1a3b2b' }}>
                      Upload Stubble Photo
                    </Typography>
                  </Box>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />

                  <Box
                    onClick={handleUploadClick}
                    sx={{
                      border: image ? "2px solid #8bc34a" : "2px dashed #b0bec5",
                      borderRadius: "20px",
                      p: image ? 0.5 : 2.5,
                      textAlign: "center",
                      cursor: "pointer",
                      background: image ? "#fff" : "rgba(244, 249, 244, 0.5)",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                      "&:hover": { 
                        background: image ? "#fff" : "rgba(232, 245, 233, 0.7)",
                        borderColor: "#4caf50",
                        transform: image ? "scale(1.01)" : "none"
                      }
                    }}
                  >
                    {image ? (
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={image}
                          alt="uploaded"
                          style={{
                            width: "100%",
                            height: "170px",
                            objectFit: "cover",
                            borderRadius: "16px",
                            display: "block"
                          }}
                        />
                        <Box sx={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)' }} />
                        <Button 
                          variant="contained" 
                          startIcon={<Camera size={14} />}
                          sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', color: '#1a3b2b', backdropFilter: 'blur(5px)', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', py: 0.5, px: 2, '&:hover': { background: '#fff' } }}
                        >
                          Change
                        </Button>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Box sx={{ p: 1.5, background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', borderRadius: '50%', mb: 1.5 }}>
                          <ImageIcon size={32} color="#2e7d32" strokeWidth={1.5} />
                        </Box>
                        <Typography variant="h6" fontWeight="800" sx={{ color: '#2e7d32', fontSize: '1rem' }}>
                          Tap to upload photo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
                          or drag & drop your field photo here
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box mt={2.5} mb={1.5} display="flex" alignItems="center">
                    <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                      CROP TYPE
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flexShrink: 0 }}>
                    {cropTypes.map((crop) => (
                      <Button
                        key={crop}
                        onClick={() => handleCropSelect(crop)}
                        variant={selectedCrop === crop ? "contained" : "outlined"}
                        sx={{
                          borderRadius: "16px",
                          textTransform: "none",
                          fontWeight: "700",
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.85rem',
                          background: selectedCrop === crop ? "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)" : "transparent",
                          color: selectedCrop === crop ? "white" : "#4caf50",
                          border: selectedCrop === crop ? "none" : "1px solid rgba(76, 175, 80, 0.5)",
                          boxShadow: selectedCrop === crop ? "0 4px 15px rgba(76, 175, 80, 0.3)" : "none",
                          "&:hover": {
                            background: selectedCrop === crop ? "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)" : "rgba(76, 175, 80, 0.08)",
                            border: selectedCrop === crop ? "none" : "1px solid #4caf50",
                          }
                        }}
                      >
                        {crop}
                      </Button>
                    ))}

                    <Button
                      onClick={handleOpenDialog}
                      sx={{
                        borderRadius: "16px",
                        textTransform: "none",
                        fontWeight: "700",
                        color: "#78909c",
                        border: "1px dashed #b0bec5",
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.85rem',
                        minWidth: 'auto',
                        "&:hover": { border: "1px dashed #78909c", background: "rgba(120, 144, 156, 0.05)" }
                      }}
                    >
                      <Plus size={16} style={{ marginRight: 4 }} /> Add
                    </Button>
                  </Box>

                  <Box mt={2.5} mb={1.5} display="flex" alignItems="center">
                    <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                      FIELD AREA
                    </Typography>
                  </Box>

                  <TextField 
                    placeholder="e.g. 2.5 Acres" 
                    fullWidth 
                    size="small"
                    InputProps={{
                      startAdornment: <MapPin size={16} color="#90a4ae" style={{ marginRight: 8 }} />,
                      sx: { borderRadius: "14px", background: "rgba(0,0,0,0.02)", "& fieldset": { borderColor: "rgba(0,0,0,0.1)" } }
                    }}
                  />

                  <Box flexGrow={1} />

                  <Button
                    fullWidth
                    onClick={handleAnalyze}
                    disabled={!image || !selectedCrop}
                    sx={{
                      mt: 2.5,
                      background: (!image || !selectedCrop) ? "#e0e0e0" : "linear-gradient(135deg, #ff8f00 0%, #ff6f00 100%)",
                      color: (!image || !selectedCrop) ? "#9e9e9e" : "white",
                      borderRadius: "16px",
                      p: 1.2,
                      fontWeight: "900",
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: (!image || !selectedCrop) ? "none" : "0 10px 25px rgba(255, 143, 0, 0.3)",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                      "&:hover": { 
                        transform: (!image || !selectedCrop) ? "none" : "translateY(-2px)",
                        boxShadow: (!image || !selectedCrop) ? "none" : "0 15px 30px rgba(255, 143, 0, 0.4)" 
                      }
                    }}
                  >
                    {isAnalyzing ? (
                      <Loader2 size={20} className="animate-spin" style={{ marginRight: 8 }} />
                    ) : (
                      <Zap size={20} style={{ marginRight: 8, fill: "currentColor" }} />
                    )}
                    {isAnalyzing ? "Analyzing Biomass..." : "Analyse with AI"}
                  </Button>

                </CardContent>
              </Card>
            </motion.div>

            <motion.div style={{ flex: "1 1 50%", minHeight: 0, display: "flex", flexDirection: "column" }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card sx={{ 
                flexGrow: 1,
                borderRadius: "28px", 
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "0 0 25px rgba(76, 175, 80, 0.2), 0 20px 50px rgba(0, 0, 0, 0.05)",
                display: "flex", 
                flexDirection: "column",
                background: "linear-gradient(145deg, #ffffff 0%, #f1f8f3 100%)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 0 35px rgba(76, 175, 80, 0.3), 0 25px 60px rgba(0, 0, 0, 0.08)" }
              }}>

                <Box sx={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle at top right, rgba(76,175,80,0.1) 0%, transparent 60%)' }} />

                <CardContent sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, md: 4 } }}>
                  
                  {isAnalyzing ? (
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', borderRadius: '50%', mb: 2.5, boxShadow: '0 10px 20px rgba(255, 152, 0, 0.2)' }}>
                          <Loader2 size={40} color="#f57c00" />
                        </Box>
                      </motion.div>
                      <Typography variant="h5" fontWeight="900" sx={{ color: '#1a3b2b', mb: 1, fontSize: '1.4rem' }}>
                        AI is Processing...
                      </Typography>
                      <Typography color="text.secondary" sx={{ maxWidth: 300, fontSize: '0.9rem' }}>
                        We are analysing the stubble density, moisture content, and optimal clearing methods.
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" sx={{ opacity: 0.7 }}>
                      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)', borderRadius: '50%', mb: 3, boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)' }}>
                        <FlaskConical size={50} color="#b0bec5" strokeWidth={1.5} />
                      </Box>
                      <Typography variant="h4" fontWeight="900" sx={{ color: '#90a4ae', mb: 1.5, letterSpacing: '-0.5px', fontSize: '1.6rem' }}>
                        No Analysis Yet
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#90a4ae", maxWidth: 320, lineHeight: 1.5, fontSize: '0.9rem' }}>
                        Upload a photo of your field, select the crop type, and let our AI engine evaluate the biomass and provide recommendations.
                      </Typography>
                    </Box>
                  )}

                </CardContent>
              </Card>
            </motion.div>

          </Box>
        </Container>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          PaperProps={{
            sx: { borderRadius: "24px", p: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }
          }}
        >
          <DialogTitle sx={{ fontWeight: "800", color: "#1a3b2b", display: "flex", alignItems: "center", gap: 1 }}>
            <Plus size={20} color="#4caf50" /> Add New Crop Type
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              placeholder="e.g., Carrot, Soybean"
              fullWidth
              value={newCropType}
              onChange={(e) => setNewCropType(e.target.value)}
              sx={{ mt: 2, '& fieldset': { borderRadius: '14px' } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseDialog} sx={{ color: "#78909c", fontWeight: "bold", textTransform: "none", mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleAddCrop} sx={{ background: "#4caf50", color: "white", borderRadius: "12px", px: 3, fontWeight: "bold", textTransform: "none", "&:hover": { background: "#388e3c" } }}>
              Add Crop
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}