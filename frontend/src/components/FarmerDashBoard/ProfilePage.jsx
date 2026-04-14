import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box, Typography, Avatar, Card, CardContent, Button, TextField,
  Grid, Select, MenuItem, FormControl, InputLabel, Chip, Dialog,
  DialogContent, IconButton, Divider, CircularProgress, Badge, Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Profile({ open, onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { session, refreshSession, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const fileRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "", phone: "", gender: "Male", location: "", pincode: "",
    landSize: "", profilePhotoUrl: "", profile: {}
  });
  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    if (open && session) {
      const data = {
        name: session.name || "",
        phone: session.mobile || "",
        gender: session.profile?.gender || "Male",
        location: session.location || "",
        pincode: session.profile?.pincode || "",
        landSize: session.profile?.landSize || "",
        profilePhotoUrl: session.profilePhotoUrl || "",
        profile: session.profile || {}
      };
      setProfileData(data);
      setFormData(data);
    }
  }, [open, session]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.patch("/users/profile", {
        name: formData.name,
        location: formData.location,
        profile: { ...formData.profile, gender: formData.gender, pincode: formData.pincode, landSize: formData.landSize }
      });
      const updatedUser = { ...session, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      refreshSession();
      setProfileData(formData);
      setIsEditing(false);
      setSnack({ open: true, msg: t("profile.saveProfile") + " ✓", severity: "success" });
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.message || "Save failed", severity: "error" });
    } finally { setLoading(false); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("profilePhoto", file);
    setLoading(true);
    try {
      const res = await api.post("/users/profile/photo", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const photoUrl = res.data.photoUrl;
      const updatedUser = { ...session, profilePhotoUrl: photoUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      refreshSession();
      setProfileData(p => ({ ...p, profilePhotoUrl: photoUrl }));
      setSnack({ open: true, msg: "Photo updated!", severity: "success" });
    } catch (e) {
      setSnack({ open: true, msg: "Photo upload failed", severity: "error" });
    } finally { setLoading(false); }
  };

  const handleSignOut = () => {
    logout();
    setIsEditing(false);
    onClose();
    navigate("/", { replace: true });
  };

  const photoSrc = profileData.profilePhotoUrl
    ? `http://localhost:5000${profileData.profilePhotoUrl}`
    : null;

  return (
    <>
      <Dialog open={open} onClose={() => { setIsEditing(false); onClose(); }} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "32px", background: "transparent", boxShadow: "0 25px 70px rgba(46,125,50,0.2)" } }}>
        <DialogContent sx={{ p: 0, background: "transparent" }}>
          <Card sx={{ borderRadius: "32px", overflow: "hidden", boxShadow: "none", backgroundColor: "white" }}>
            <IconButton onClick={() => { setIsEditing(false); onClose(); }}
              sx={{ position: "absolute", right: 15, top: 15, zIndex: 10, background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <CloseIcon sx={{ color: "#2e7d32" }} />
            </IconButton>

            {/* Header with photo */}
            <Box sx={{ backgroundImage: "url('/assets/FarmLand.jpg')", backgroundSize: "cover", backgroundPosition: "center", p: 4, textAlign: "center", color: "white", position: "relative", minHeight: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", "&::before": { content: '""', position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 0 } }}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Badge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <IconButton size="small" onClick={() => fileRef.current?.click()}
                      sx={{ bgcolor: "#2e7d32", color: "white", width: 32, height: 32, "&:hover": { bgcolor: "#1b5e20" } }}>
                      <PhotoCameraIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  }>
                  <Avatar src={photoSrc} sx={{ width: 100, height: 100, fontSize: "36px", border: "4px solid white", bgcolor: "#1b5e20", mx: "auto" }}>
                    {!photoSrc && (profileData.name?.charAt(0) || "?")}
                  </Avatar>
                </Badge>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                <Typography variant="h5" fontWeight="bold" mt={2}>{profileData.name}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {session?.role === "farmer" ? "EcoStubble Farmer" : session?.role === "aggregator" ? "Aggregator" : "Industry"}
                </Typography>
                {session?.role === "farmer" && profileData.landSize && (
                  <Chip label={`${profileData.landSize} Acres`} sx={{ mt: 1.5, bgcolor: "white", color: "#2e7d32", fontWeight: "bold" }} />
                )}
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {!isEditing ? (
                <>
                  <Grid container spacing={2.5} mb={3}>
                    <Grid item xs={12} sm={6}><ProfileBox label={t("profile.phone")} value={profileData.phone || "—"} /></Grid>
                    <Grid item xs={12} sm={6}><ProfileBox label={t("profile.gender")} value={profileData.gender || "—"} /></Grid>
                    <Grid item xs={12} sm={6}><ProfileBox label={t("profile.location")} value={profileData.location || "—"} /></Grid>
                    {profileData.pincode && <Grid item xs={12} sm={6}><ProfileBox label={t("profile.pincode")} value={profileData.pincode} /></Grid>}
                    {session?.role === "farmer" && profileData.landSize && (
                      <Grid item xs={12} sm={6}><ProfileBox label={t("profile.landSize")} value={`${profileData.landSize} acres`} /></Grid>
                    )}
                    {session?.role === "aggregator" && (
                      <>
                        {session.profile?.vehicleType && <Grid item xs={12} sm={6}><ProfileBox label={t("profile.vehicleType")} value={session.profile.vehicleType} /></Grid>}
                        {session.profile?.storageCapacity && <Grid item xs={12} sm={6}><ProfileBox label={t("profile.storageCapacity")} value={`${session.profile.storageCapacity}t`} /></Grid>}
                      </>
                    )}
                    {session?.role === "industry" && (
                      <>
                        {session.profile?.companyName && <Grid item xs={12}><ProfileBox label={t("profile.companyName")} value={session.profile.companyName} /></Grid>}
                        {session.profile?.industryType && <Grid item xs={12} sm={6}><ProfileBox label={t("profile.industryType")} value={session.profile.industryType} /></Grid>}
                      </>
                    )}
                  </Grid>
                  <Divider sx={{ mb: 2.5 }} />
                  <Button variant="contained" startIcon={<EditIcon />} fullWidth onClick={() => setIsEditing(true)}
                    sx={{ background: "linear-gradient(135deg,#2e7d32,#43a047)", fontWeight: "bold", py: 1.5, borderRadius: 3, mb: 1.5 }}>
                    {t("profile.editProfile")}
                  </Button>
                  <Button variant="outlined" startIcon={<LogoutIcon />} fullWidth onClick={handleSignOut}
                    sx={{ borderColor: "#c62828", color: "#c62828", fontWeight: "bold", py: 1.5, borderRadius: 3 }}>
                    {t("profile.signOut")}
                  </Button>
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField fullWidth label={t("profile.name")} value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label={t("profile.location")} value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} /></Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth><InputLabel>{t("profile.gender")}</InputLabel>
                        <Select label={t("profile.gender")} value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}>
                          <MenuItem value="Male">{t("profile.male")}</MenuItem>
                          <MenuItem value="Female">{t("profile.female")}</MenuItem>
                          <MenuItem value="Other">{t("profile.other")}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label={t("profile.pincode")} value={formData.pincode} onChange={e => setFormData(p => ({ ...p, pincode: e.target.value }))} /></Grid>
                    {session?.role === "farmer" && (
                      <Grid item xs={12}><TextField fullWidth type="number" label={t("profile.landSize")} value={formData.landSize} onChange={e => setFormData(p => ({ ...p, landSize: e.target.value }))} /></Grid>
                    )}
                  </Grid>
                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} fullWidth disabled={loading}
                      sx={{ background: "linear-gradient(135deg,#2e7d32,#43a047)", borderRadius: 3, py: 1.5 }}>
                      {t("common.save")}
                    </Button>
                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setIsEditing(false)} fullWidth
                      sx={{ borderColor: "#2e7d32", color: "#2e7d32", borderRadius: 3, py: 1.5 }}>
                      {t("common.cancel")}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 3 }}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}

function ProfileBox({ label, value }) {
  return (
    <Box sx={{ p: 2, borderRadius: "16px", background: "#f8faf8", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.3s ease", "&:hover": { boxShadow: "0 8px 20px rgba(46,125,50,0.1)", transform: "translateY(-2px)" } }}>
      <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: "bold" }}>{label}</Typography>
      <Typography variant="h6" sx={{ mt: 0.5, fontSize: "1rem" }}>{value}</Typography>
    </Box>
  );
}