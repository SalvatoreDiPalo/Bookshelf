import { ChildrenProps } from '@/types/props/children-props';
import { createTheme, PaletteMode, ThemeProvider } from '@mui/material';
import { indigo } from '@mui/material/colors';
import { useContext, createContext, useState, useEffect, useMemo } from 'react';

export interface IAuth {
  updateTheme: () => void;
}

const defaultState: IAuth = {
  updateTheme() {},
};

const BookThemeContext = createContext(defaultState);

const BookThemeProvider = ({ children }: ChildrenProps) => {
  const [theme, setTheme] = useState<PaletteMode>(() => {
    let initialTheme = localStorage.getItem('theme');
    initialTheme = initialTheme ? initialTheme : 'light';
    return initialTheme as PaletteMode;
  });

  const themeObject = useMemo(() => {
    const secondBackground = theme == 'light' ? '#F4F5F9' : '#272727';
    return createTheme({
      palette: {
        mode: theme,
        primary: {
          main: indigo.A200,
          secondBackground: secondBackground,
        },
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: theme == 'light' ? '#fff' : '#000',
              color: indigo.A200,
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: secondBackground,
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              backgroundColor: secondBackground,
            },
          },
        },
      },
    });
  }, [theme]);

  function getThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as PaletteMode);
    }
  }

  function toggleTheme() {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }

  useEffect(() => {
    getThemeFromLocalStorage();
  }, [theme]);

  const state: IAuth = {
    updateTheme: toggleTheme,
  };

  return (
    <BookThemeContext.Provider value={state}>
      <ThemeProvider theme={themeObject}>{children}</ThemeProvider>
    </BookThemeContext.Provider>
  );
};
export default BookThemeProvider;

export const useBookTheme = () => {
  return useContext(BookThemeContext);
};
