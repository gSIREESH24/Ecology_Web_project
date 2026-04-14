import React, { useState } from 'react';
import { 
  Box, Card, Typography, Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, MenuItem, Select
} from '@mui/material';
import { PackageSearch, Filter, MapPin, CheckCircle2, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

const marketplaceData = [
  {
    id: 1,
    name: 'RuralFuel Network',
    location: 'Bathinda',
    verified: true,
    type: 'Sugarcane Bagasse',
    emoji: '🎋',
    qty: 200,
    price: 780,
    grade: 'Grade A',
    delivery: '5d'
  },
  {
    id: 2,
    name: 'GreenHarvest Ltd.',
    location: 'Amritsar',
    verified: true,
    type: 'Paddy Stubble',
    emoji: '🌾',
    qty: 140,
    price: 950,
    grade: 'Grade A',
    delivery: '3d'
  },
  {
    id: 3,
    name: 'BioSource Collective',
    location: 'Sangrur',
    verified: true,
    type: 'Paddy Stubble',
    emoji: '🌾',
    qty: 110,
    price: 900,
    grade: 'Grade A',
    delivery: '2d'
  },
  {
    id: 4,
    name: 'Punjab Biomass Co.',
    location: 'Ludhiana',
    verified: true,
    type: 'Wheat Straw',
    emoji: '🌾',
    qty: 85,
    price: 1200,
    grade: 'Grade A',
    delivery: '2d'
  },
  {
    id: 5,
    name: 'EcoFuel Aggregators',
    location: 'Jalandhar',
    verified: false,
    type: 'Wheat Straw',
    emoji: '🌾',
    qty: 60,
    price: 1100,
    grade: 'Grade B',
    delivery: '2d'
  },
  {
    id: 6,
    name: 'Kisan Biomass Hub',
    location: 'Patiala',
    verified: false,
    type: 'Maize Stalks',
    emoji: '🌽',
    qty: 45,
    price: 850,
    grade: 'Grade B',
    delivery: '4d'
  },
  {
    id: 7,
    name: 'HarvestLink Punjab',
    location: 'Ropar',
    verified: false,
    type: 'Cotton Stalks',
    emoji: '🌸',
    qty: 30,
    price: 1050,
    grade: 'Grade C',
    delivery: '3d'
  }
];

export default function Marketplace() {
  const [filter, setFilter] = useState('All');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        sx={{ 
          borderRadius: '24px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }} 
        elevation={0}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}
            >
              <PackageSearch size={24} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800, 
                color: '#0f172a',
                letterSpacing: '-0.5px'
              }}
            >
              Biomass Supply Marketplace
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Filter size={18} color="#64748b" />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="small"
              sx={{ 
                borderRadius: '10px', 
                minWidth: 120,
                color: '#1e293b',
                fontWeight: 600,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' }
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Wheat Straw">Wheat Straw</MenuItem>
              <MenuItem value="Paddy Stubble">Paddy Stubble</MenuItem>
              <MenuItem value="Grade A">Grade A</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }}>AGGREGATOR</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }}>BIOMASS TYPE ↑↓</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }} align="right">QTY (T) ⌄</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }} align="right">PRICE/TON ↑↓</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }} align="center">GRADE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }} align="center">DELIVERY ↑↓</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '13px', py: 2 }} align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marketplaceData.map((row) => (
                <TableRow 
                  key={row.id} 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      '& td': { borderColor: '#e2e8f0' }
                    }
                  }}
                >
                  <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 2.5 }}>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{row.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                        <MapPin size={12} />
                        <Typography sx={{ fontSize: '12px' }}>{row.location}</Typography>
                      </Box>
                      {row.verified && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#16a34a' }}>
                          <CheckCircle2 size={12} />
                          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Verified</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <span style={{ fontSize: '20px' }}>{row.emoji}</span>
                      <Typography sx={{ color: '#334155', fontWeight: 500 }}>{row.type}</Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>
                      {row.qty} <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>t</span>
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 700, color: '#334155' }}>
                      ₹{row.price.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Chip 
                      label={row.grade} 
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '12px',
                        backgroundColor: row.grade === 'Grade A' ? '#dcfce7' : row.grade === 'Grade B' ? '#fef9c3' : '#fee2e2',
                        color: row.grade === 'Grade A' ? '#166534' : row.grade === 'Grade B' ? '#a16207' : '#991b1b',
                        borderRadius: '6px'
                      }} 
                    />
                  </TableCell>
                  
                  <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#64748b' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{row.delivery}</Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Button
                      variant="contained"
                      startIcon={<Handshake size={16} />}
                      sx={{
                        backgroundColor: '#3b82f6',
                        boxShadow: 'none',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 2,
                        '&:hover': {
                          backgroundColor: '#2563eb',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }
                      }}
                    >
                      Request
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ p: 2, px: 3, backgroundColor: '#fcfcfc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
            Showing {marketplaceData.length} of {marketplaceData.length} listings · Click column headers to sort
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
}
