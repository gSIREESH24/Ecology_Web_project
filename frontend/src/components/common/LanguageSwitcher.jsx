import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🏳️" },
  { code: "ta", label: "தமிழ்", flag: "🏳️" },
  { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🏳️" },
  { code: "ml", label: "മലയാളം", flag: "🏳️" },
  { code: "mr", label: "मराठी", flag: "🏳️" },
];

export default function LanguageSwitcher({ color = "black", variant = "text" }) {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("appLanguage", code);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<LanguageIcon />}
        variant={variant}
        size="small"
        sx={{
          textTransform: "none",
          color,
          fontWeight: 600,
          fontSize: "0.85rem",
          borderRadius: "20px",
          px: 1.5,
        }}
      >
        {currentLang.flag} {currentLang.label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            selected={i18n.language === lang.code}
            sx={{
              borderRadius: "8px",
              mx: 0.5,
              py: 1,
              "&.Mui-selected": { bgcolor: "rgba(46,125,50,0.08)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Typography fontSize="1.2rem">{lang.flag}</Typography>
            </ListItemIcon>
            <ListItemText primary={lang.label} />
            {i18n.language === lang.code && (
              <CheckIcon fontSize="small" sx={{ color: "#2e7d32", ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
