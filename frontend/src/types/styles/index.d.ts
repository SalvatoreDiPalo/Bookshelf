import "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteColor {
    secondBackground?: string;
  }

  interface SimplePaletteColorOptions {
    secondBackground?: string;
  }
  interface PaletteColorOptions {
    secondBackground?: string;
  }
}
