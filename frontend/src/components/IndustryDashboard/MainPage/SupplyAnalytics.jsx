import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Box, Card, Typography, Button } from '@mui/material';
import { BarChart as BarChartIcon, TrendingUp, Package, AlertCircle } from 'lucide-react';

const monthlyData = [
  { name: 'Sep', Supply: 180, Demand: 220 },
  { name: 'Oct', Supply: 350, Demand: 300 },
  { name: 'Nov', Supply: 500, Demand: 400 },
  { name: 'Dec', Supply: 680, Demand: 580 },
  { name: 'Jan', Supply: 410, Demand: 480 },
  { name: 'Feb', Supply: 280, Demand: 320 },
  { name: 'Mar', Supply: 850, Demand: 710 },
];

const typeData = [
  { name: 'Wheat Straw', Available: 140, Contracted: 60 },
  { name: 'Paddy Stubble', Available: 250, Contracted: 110 },
  { name: 'Maize Stalks', Available: 40, Contracted: 15 },
  { name: 'Sugarcane', Available: 200, Contracted: 80 },
  { name: 'Cotton Stalks', Available: 25, Contracted: 5 },
];

const totalSupply = monthlyData.reduce((sum, d) => sum + d.Supply, 0);
const totalDemand = monthlyData.reduce((sum, d) => sum + d.Demand, 0);
const supplyGap = totalDemand - totalSupply;
const totalAvailable = typeData.reduce((sum, d) => sum + d.Available, 0);
const totalContracted = typeData.reduce((sum, d) => sum + d.Contracted, 0);

const CustomLegend = ({ payload, view }) => {
  const colorMap = {
    'Supply': '#3b82f6',
    'Demand': '#f59e0b',
    'Available': '#3b82f6',
    'Contracted': '#22c55e'
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, pt: 3, flexWrap: 'wrap' }}>
      {payload.map((entry, index) => {
        const color = colorMap[entry.value] || entry.color;
        const isDashed = entry.value === 'Demand';
        
        return (
          <Box 
            key={`item-${index}`} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            {isDashed ? (
              <Box sx={{ width: 16, height: 2, backgroundColor: color, position: 'relative' }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#fff', border: `2.5px solid ${color}`, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </Box>
            ) : (
              <Box 
                sx={{ 
                  width: 14, 
                  height: 14, 
                  backgroundColor: color, 
                  borderRadius: '3px',
                  boxShadow: `0 2px 8px ${color}40`
                }} 
              />
            )}
            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, fontSize: 14, letterSpacing: 0.3 }}>
              {entry.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, unit, color, bgColor, trend }) => (
  <Card
    sx={{
      p: 2.5,
      borderRadius: '16px',
      border: '1px solid',
      borderColor: bgColor,
      backgroundColor: `${bgColor}15`,
      boxShadow: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px -6px ${bgColor}30`,
        borderColor: color,
      }
    }}
    elevation={0}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#64748b', 
            fontWeight: 600, 
            fontSize: 12, 
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
          <Typography 
            sx={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              color: '#0f172a',
              letterSpacing: '-0.5px'
            }}
          >
            {value}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '14px', 
              color: '#64748b', 
              fontWeight: 500 
            }}
          >
            {unit}
          </Typography>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <TrendingUp size={14} color={trend > 0 ? '#22c55e' : '#ef4444'} />
            <Typography 
              sx={{ 
                fontSize: '12px', 
                color: trend > 0 ? '#22c55e' : '#ef4444',
                fontWeight: 600 
              }}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1.5px solid ${color}30`
        }}
      >
        <Icon size={24} color={color} strokeWidth={1.8} />
      </Box>
    </Box>
  </Card>
);

export default function SupplyAnalytics() {
  const [view, setView] = useState('type');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card 
        sx={{
          borderRadius: '20px',
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 20px 40px -10px rgba(102, 126, 234, 0.3)',
          border: 'none',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }
        }}
        elevation={0}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1 }}>
            <Box 
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}
            >
              <BarChartIcon size={28} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: '28px',
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                Supply Analytics
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '14px', 
                  opacity: 0.9,
                  fontWeight: 500,
                  letterSpacing: 0.3
                }}
              >
                Real-time biomass inventory & market insights
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5 }}>
        <StatCard 
          icon={Package}
          label="Total Supply" 
          value={totalSupply} 
          unit="tons"
          color="#3b82f6"
          bgColor="#3b82f6"
          trend={12}
        />
        <StatCard 
          icon={AlertCircle}
          label="Total Demand" 
          value={totalDemand} 
          unit="tons"
          color="#f59e0b"
          bgColor="#f59e0b"
          trend={8}
        />
        <StatCard 
          icon={TrendingUp}
          label="Available Stock" 
          value={totalAvailable} 
          unit="tons"
          color="#22c55e"
          bgColor="#22c55e"
          trend={15}
        />
        <StatCard 
          icon={BarChartIcon}
          label="Contracted" 
          value={totalContracted} 
          unit="tons"
          color="#8b5cf6"
          bgColor="#8b5cf6"
          trend={5}
        />
      </Box>

      <Card 
        sx={{
          borderRadius: '20px',
          p: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s ease'
        }} 
        elevation={0}
      >

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                fontSize: '20px',
                color: '#0f172a',
                letterSpacing: '-0.5px'
              }}
            >
              {view === 'trend' ? 'Monthly Trend Analysis' : 'Biomass Type Breakdown'}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '13px', 
                color: '#64748b', 
                mt: 0.5,
                fontWeight: 500,
                letterSpacing: 0.3
              }}
            >
              {view === 'trend' ? 'Supply vs. Demand patterns over time (tons)' : 'Available vs. Contracted inventory by biomass type (tons)'}
            </Typography>
          </Box>

          <Box sx={{
            display: 'inline-flex',
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            p: 0.5,
            border: '1px solid #e2e8f0',
            gap: 0.5,
            transition: 'all 0.3s ease'
          }}>
            {['type', 'trend'].map((viewType) => (
              <Button
                key={viewType}
                disableElevation
                variant={view === viewType ? 'contained' : 'text'}
                onClick={() => setView(viewType)}
                sx={{
                  borderRadius: '12px',
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: 0.3,
                  color: view === viewType ? '#ffffff' : '#64748b',
                  backgroundColor: view === viewType ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: view === viewType ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f4f8',
                    transform: view === viewType ? 'scale(1.02)' : 'none'
                  }
                }}
              >
                {viewType === 'type' ? '📊 By Type' : '📈 Monthly Trend'}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderBottom: '1px solid #e2e8f0', mx: -4, mb: 4, mt: 3 }} />

        <Box sx={{ height: 450, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {view === 'trend' ? (
              <LineChart data={monthlyData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e2e8f0" strokeWidth={1} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }}
                  dx={-10}
                  domain={[0, 1000]}
                  ticks={[0, 250, 500, 750, 1000]}
                />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                    backgroundColor: '#ffffff',
                    padding: '16px'
                  }}
                  itemStyle={{ fontWeight: 700, fontSize: 14 }}
                  labelStyle={{ color: '#0f172a', fontWeight: 800, fontSize: 14, marginBottom: 8 }}
                />
                <Legend content={<CustomLegend view="trend" />} />
                <Line
                  name="Supply"
                  type="monotone"
                  dataKey="Supply"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#3b82f6', shadow: '0 4px 12px -4px rgba(59, 130, 246, 0.4)' }}
                />
                <Line
                  name="Demand"
                  type="monotone"
                  dataKey="Demand"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  dot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#f59e0b' }}
                />
              </LineChart>
            ) : (
              <BarChart data={typeData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorContracted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e2e8f0" strokeWidth={1} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }}
                  dx={-10}
                  domain={[0, 260]}
                  ticks={[0, 65, 130, 195, 260]}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc', stroke: 'none' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                    backgroundColor: '#ffffff',
                    padding: '16px'
                  }}
                  itemStyle={{ fontWeight: 700, fontSize: 14 }}
                  labelStyle={{ color: '#0f172a', fontWeight: 800, fontSize: 14, marginBottom: 8 }}
                />
                <Legend content={<CustomLegend view="type" />} />
                <Bar name="Available" dataKey="Available" fill="url(#colorAvailable)" radius={[8, 8, 0, 0]} barSize={72} />
                <Bar name="Contracted" dataKey="Contracted" fill="url(#colorContracted)" radius={[8, 8, 0, 0]} barSize={72} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}
