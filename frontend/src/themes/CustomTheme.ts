import { createTheme, type Shadows } from "@mui/material";

const CustomTheme = createTheme({
  palette: {
    mode: "light",

    // GOLD LUXURY
    primary: {
      main: "#C9A96E",
      light: "#E6C58A",
      dark: "#A88446",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#F5EFE4",
      light: "#FFF8ED",
      dark: "#E7D9BE",
      contrastText: "#6B4F1D",
    },

    background: {
      default: "#FAF8F3",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#3B2B12",
      secondary: "#8B7355",
    },

    divider: "#EEE4D2",

    success: {
      main: "#22C55E",
    },

    error: {
      main: "#DC2626",
    },
  },

  typography: {
    fontFamily: "'Be Vietnam Pro', sans-serif",

    h1: {
      fontWeight: 800,
      letterSpacing: "-1px",
      color: "#3B2B12",
    },

    h2: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
      color: "#3B2B12",
    },

    h3: {
      fontWeight: 700,
      color: "#3B2B12",
    },

    h4: {
      fontWeight: 600,
      color: "#3B2B12",
    },

    h5: {
      fontWeight: 600,
      color: "#3B2B12",
    },

    h6: {
      fontWeight: 600,
      color: "#3B2B12",
    },

    subtitle1: {
      color: "#8B7355",
      fontWeight: 500,
    },

    body1: {
      lineHeight: 1.7,
      color: "#5C4A2F",
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 18,
  },

  shadows: [
    "none",
    "0 2px 6px rgba(201,169,110,0.08)",
    "0 6px 16px rgba(201,169,110,0.10)",
    "0 10px 24px rgba(201,169,110,0.12)",
    "0 14px 34px rgba(201,169,110,0.14)",
    ...Array(20).fill("0 14px 34px rgba(201,169,110,0.14)"),
  ] as unknown as Shadows,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(to bottom right, #FFFDF8, #FAF5EA)",
          color: "#3B2B12",
          scrollBehavior: "smooth",
        },

        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },

        "*::-webkit-scrollbar-thumb": {
          background: "#D4B483",
          borderRadius: "20px",
        },

        "*::-webkit-scrollbar-thumb:hover": {
          background: "#BE9A61",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: "0 10px 40px rgba(201,169,110,0.10)",
          border: "1px solid #F2E8D7",
          background: "#FFFFFF",
        },
      },
    },

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
          textTransform: "none",
          borderRadius: "16px",
          padding: "11px 24px",
          transition: "all .3s ease",
          fontWeight: 700,
          boxShadow: "none",

          "@media (max-width:600px)": {
            padding: "8px 16px",
            fontSize: "13px",
            borderRadius: "12px",
          },
        },

        // MAIN GOLD BUTTON
        containedPrimary: {
          background:
            "linear-gradient(135deg, #D6B57A 0%, #C9A96E 50%, #B88A44 100%)",
          color: "#fff",
          border: "1px solid transparent",

          "&:hover": {
            background: "#fff",
            color: "#B88A44",
            border: "1px solid #C9A96E",
            boxShadow: "0 10px 24px rgba(201,169,110,0.25)",
          },
        },

        containedSecondary: {
          background: "#F5EFE4",
          color: "#A88446",

          "&:hover": {
            background: "#EDE2CE",
          },
        },

        outlinedPrimary: {
          border: "1px solid #C9A96E",
          color: "#B88A44",

          "&:hover": {
            background: "#C9A96E",
            color: "#fff",
          },
        },
      } as unknown as Record<string, unknown>,
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            background: "#fff",

            "& fieldset": {
              borderColor: "#EADFCB",
            },

            "&:hover fieldset": {
              borderColor: "#C9A96E",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#C9A96E",
              borderWidth: "2px",
            },
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255,248,237,0.85)",
          backdropFilter: "blur(14px)",
          color: "#6B4F1D",
          boxShadow: "0 2px 20px rgba(201,169,110,0.08)",
          borderBottom: "1px solid #F2E8D7",
        },
      },
    },
  },
});

export default CustomTheme;
