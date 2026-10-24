import { createTheme } from "@mui/material";

// These values match the blue and neutral tokens used across the app in index.css.
const CustomTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1677FF",
      light: "#4096FF",
      dark: "#0052CC",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F0F3FF",
      light: "#F9F9FF",
      dark: "#DEE8FF",
      contrastText: "#111C2D",
    },
    background: {
      default: "#F9F9FF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111C2D",
      secondary: "#424656",
    },
    divider: "#E2E8F0",
    success: {
      main: "#00A389",
    },
    error: {
      main: "#BA1A1A",
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
        },
      },
    },
  },
});

export default CustomTheme;
