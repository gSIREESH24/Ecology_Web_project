import { Box } from "@mui/material";
import Navbar from "../NavBar/navbar";
import MainPage from "./MainPage/MainPage";

export default function Dashboard() {
  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh" }}>

      <Navbar />

      <MainPage />

    </Box>
  );
}