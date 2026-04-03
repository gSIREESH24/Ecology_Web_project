import React, { useState } from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { LayoutDashboard, Store } from "lucide-react";
import Navbar from "./Navbar/navbar";
import SupplyAnalytics from "./MainPage/SupplyAnalytics";
import DemandPostings from "./MainPage/DemandPostings";
import Marketplace from "./MainPage/Marketplace";

export default function IndustryDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <Box
        sx={{
          borderRadius: 3,
          mt: { xs: 2, md: 4 },
          pb: { xs: 3, md: 5 },
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1200px",
            lg: "1400px",
            xl: "1600px"
          },
          mx: "auto",
          width: "100%",
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={currentView}
            exclusive
            onChange={(e, newView) => {
              if (newView !== null) setCurrentView(newView);
            }}
            sx={{
              backgroundColor: '#ffffff',
              p: 0.5,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '12px !important',
                mx: 0.5,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '15px',
                color: '#64748b',
                gap: 1,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                  '&:hover': {
                    backgroundColor: '#1e293b'
                  }
                },
                '&:hover:not(.Mui-selected)': {
                  backgroundColor: '#f1f5f9'
                }
              }
            }}
          >
            <ToggleButton value="dashboard" disableRipple>
              <LayoutDashboard size={18} />
              Dashboard Overview
            </ToggleButton>
            <ToggleButton value="marketplace" disableRipple>
              <Store size={18} />
              Supply Marketplace
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {currentView === 'dashboard' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>
            <DemandPostings />
            <SupplyAnalytics />
          </Box>
        ) : (
          <Marketplace />
        )}
      </Box>

    </Box>
  );
}