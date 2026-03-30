import { Box, Container, CssBaseline } from "@mui/material";
import Navbar from "./NavBar/navbar";
import MainPage from "./MainPage/MainPage";

export default function Dashboard() {
  return (
    <Box sx={{ 
      background: "radial-gradient(circle at 10% 20%, rgb(250, 252, 251) 0%, rgb(240, 246, 242) 90.2%)", 
      minHeight: "100vh", position: 'relative', overflowX: 'hidden'
    }}>
      <CssBaseline />
      
      <Box sx={{ position:'absolute', top:0, left:0, width:'100%', height:'500px', background:'linear-gradient(180deg, rgba(76, 175, 80, 0.04) 0%, rgba(255,255,255,0) 100%)', zIndex: 0, pointerEvents: 'none' }} />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Container maxWidth="xl" disableGutters>
          <MainPage />
        </Container>
      </Box>

    </Box>
  );
}