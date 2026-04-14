import React, { useState } from 'react';
import { 
  Box, Card, Typography, Button, Divider, Dialog, IconButton, 
  Grid, TextField, InputAdornment 
} from '@mui/material';
import { FileText, PackagePlus, Clock, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialDemandData = [
  {
    id: 1,
    title: 'Paddy Stubble',
    status: 'Matched',
    needed: '200t',
    offered: '₹980/t',
    time: '2 days ago',
    budget: '₹1,96,000'
  },
  {
    id: 2,
    title: 'Wheat Straw',
    status: 'Open',
    needed: '100t',
    offered: '₹1,150/t',
    time: '5 days ago',
    budget: '₹1,15,000'
  }
];

const biomassTypes = [
  'Wheat Straw', 'Paddy Stubble', 'Maize Stalks', 
  'Sugarcane Bagasse', 'Cotton Stalks', 'Rice Husk'
];

export default function DemandPostings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Wheat Straw');
  const [requiredTons, setRequiredTons] = useState('');
  const [priceOffered, setPriceOffered] = useState('');
  const [demands, setDemands] = useState(initialDemandData);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRequiredTons('');
    setPriceOffered('');
    setSelectedType('Wheat Straw');
  };

  const handlePostDemand = () => {
    if (!requiredTons || !priceOffered) return;
    
    const tons = Number(requiredTons);
    const price = Number(priceOffered);
    const totalBudget = tons * price;
    
    const newDemand = {
      id: Date.now(),
      title: selectedType,
      status: 'Open',
      needed: `${tons}t`,
      offered: `₹${price.toLocaleString('en-IN')}/t`,
      time: 'Just now',
      budget: `₹${totalBudget.toLocaleString('en-IN')}`
    };

    setDemands([newDemand, ...demands]);
    handleCloseModal();
  };

  return (
    <>
    <Card 
      sx={{ 
        borderRadius: '20px', 
        p: { xs: 3, md: 4 }, 
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0',
        mt: 4
      }} 
      elevation={0}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box 
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={28} color="#d97706" />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              fontSize: '24px',
              color: '#0f172a',
              letterSpacing: '-0.5px',
              fontFamily: 'inherit'
            }}
          >
            My Demand Postings
          </Typography>
        </Box>
        <Button
          variant="text"
          startIcon={<PackagePlus size={18} />}
          onClick={handleOpenModal}
          sx={{
            color: '#3b82f6',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '15px',
            fontFamily: 'inherit',
            '&:hover': {
              backgroundColor: '#eff6ff'
            }
          }}
        >
          New
        </Button>
      </Box>

      <Divider sx={{ borderColor: '#e2e8f0', mx: { xs: -3, md: -4 } }} />

      {/* List */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence initial={false}>
          {demands.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Box 
              sx={{ 
                py: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              {/* Left Content */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#1e293b', fontFamily: 'inherit' }}>
                    {item.title}
                  </Typography>
                  <Box 
                    sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: '20px', 
                      backgroundColor: item.status === 'Matched' ? '#dcfce7' : '#e0e7ff',
                      color: item.status === 'Matched' ? '#16a34a' : '#4338ca',
                      fontSize: '13px',
                      fontWeight: 600,
                      fontFamily: 'inherit'
                    }}
                  >
                    {item.status}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: 1.5 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '15px', fontFamily: 'inherit' }}>
                    <span style={{ color: '#475569', fontWeight: 700 }}>{item.needed}</span> needed · {item.offered} offered
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                  <Clock size={14} />
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, fontFamily: 'inherit' }}>
                    {item.time}
                  </Typography>
                </Box>
              </Box>

              {/* Right Content */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#0f172a', fontFamily: 'inherit' }}>
                  {item.budget}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '14px', fontWeight: 500, fontFamily: 'inherit' }}>
                  total budget
                </Typography>
              </Box>
            </Box>
            {index < demands.length - 1 && <Divider sx={{ borderColor: '#f1f5f9', mx: { xs: -3, md: -4 } }} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Card>

      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1,
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            fontFamily: '"Inter", "Outfit", sans-serif'
          }
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: '#e0efff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6'
                }}
              >
                <PackagePlus size={24} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2, fontFamily: 'inherit' }}>
                  Post Demand
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '14px', mt: 0.5, fontFamily: 'inherit' }}>
                  Aggregators will see your request
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseModal} sx={{ color: '#64748b' }}>
              <X size={20} />
            </IconButton>
          </Box>

          <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 2, fontSize: '15px', fontFamily: 'inherit' }}>
            Biomass Type Required
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            {biomassTypes.map((type) => (
              <Grid item xs={6} key={type}>
                <Box
                  onClick={() => setSelectedType(type)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: '16px',
                    border: '1.5px solid',
                    borderColor: selectedType === type ? '#3b82f6' : '#e2e8f0',
                    backgroundColor: selectedType === type ? '#f0f7ff' : '#ffffff',
                    color: selectedType === type ? '#2563eb' : '#475569',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    fontFamily: 'inherit'
                  }}
                >
                  {type}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '15px', fontFamily: 'inherit' }}>
                Required (tons)
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 50"
                variant="outlined"
                value={requiredTons}
                onChange={(e) => setRequiredTons(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end"><Typography sx={{fontWeight: 700, color: '#0f172a', fontFamily: 'inherit'}}>t</Typography></InputAdornment>,
                  sx: { borderRadius: '16px', fontFamily: 'inherit', '& fieldset': { borderColor: '#e2e8f0'} }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '15px', fontFamily: 'inherit' }}>
                Price Offered (₹/t)
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 1100"
                variant="outlined"
                value={priceOffered}
                onChange={(e) => setPriceOffered(e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography sx={{fontWeight: 700, color: '#64748b', fontFamily: 'inherit'}}>₹</Typography></InputAdornment>,
                  sx: { borderRadius: '16px', fontFamily: 'inherit', '& fieldset': { borderColor: '#e2e8f0'} }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, p: 3, pt: 2 }}>
          <Button
            fullWidth
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              borderRadius: '16px',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              color: '#16a34a',
              borderColor: '#bbf7d0',
              fontFamily: 'inherit',
              '&:hover': {
                backgroundColor: '#f0fdf4',
                borderColor: '#16a34a'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handlePostDemand}
            variant="contained"
            startIcon={<Send size={18} />}
            sx={{
              borderRadius: '16px',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              backgroundColor: '#818cf8',
              boxShadow: 'none',
              fontFamily: 'inherit',
              '&:hover': {
                backgroundColor: '#6366f1',
                boxShadow: 'none'
              }
            }}
          >
            Post Demand
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
