
import { 
  createTheme, 
  ThemeProvider, 
} from '@mui/material/styles'; //, MuiThemeProvider 
//
import CssBaseline from '@mui/material/CssBaseline';
//
import Container from '@mui/material/Container';
//
let theme = createTheme({
  // 220617 - typography overrides  
  typography: {
    h6: {
      fontWeight: 400,
      fontSize: '1.36rem',
    },
  },
  components: {
    //220418 - use mediaquery, ssr renders twice, set nossr to optimize client side rendering
    //https://mui.com/material-ui/react-use-media-query/
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  // 220429 - textfield default to filled
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        fullWidth: true,
        autoCapitalize: "words",
      },
    },
    MuiButton: {
      defaultProps: {
        type: "button",
        variant: "contained",
        disableElevation: true,
      },
    }, 
    MuiFilledInput: {
      defaultProps: {
        disableUnderline: true
      },
    },
    MuiStepper: {
      defaultProps: {
        alternativeLabel: true
      },
    },
    MuiCardHeader: {
      styleOverrides:{
        avatar: {
          minWidth: 48,
        },  
      },
    },
  }
});
//
theme = createTheme( theme, {
  components: {
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.08rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.98rem',
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    },
    MuiAlertIcon: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 400,
          //lineHeight: 1.5,
        },
      },
    },
    MuiStepIcon: {
      styleOverrides:{
        root: {
          transition: theme.transitions.create(['color','transform']),      
          width: '1.08rem',
          height: '1.08rem',  
          '&.Mui-completed:not(.Mui-active):not(.Mui-error)': {
            color: theme.palette.primary.light,
          },
          '&.Mui-active': {
            // color: theme.palette.primary.dark,
            width: '1.26rem',
            height: '1.26rem',        
          },   
          '&.Mui-error': {      
            color: theme.palette.error.light,
            width: '1.2rem',
            height: '1.2rem',
          }, 
          '&.Mui-error.Mui-active': {      
            color: theme.palette.error.main,
            width: '1.5rem',
            height: '1.5rem',
          },    
        },
      },
    },
    MuiStepLabel: {
      styleOverrides:{
        label: {
          transition: theme.transitions.create('color'),
          fontSize: '1.0rem',
          '&.MuiStepLabel-label.Mui-completed:not(.Mui-active):not(.Mui-error)': {
            color: theme.palette.text.disabled,
            fontWeight: 400,
          },
          '&.Mui-error:not(.Mui-active)': {
            color: theme.palette.error.light, 
            // fontSize: '0.9rem',
            fontWeight: 400,
          },
          '&.Mui-active': {
            fontSize: '1.15rem',
            //color: theme.palette.text.primary, //color: '#4f51b5',
            fontWeight: 400,
          },
        },  
      },
    },
    // 220608 - need to validate
    MuiFormHelperText: {
      styleOverrides:{
        root: {
          '&.Mui-error': {
            position: 'absolute',
            top: '100%'
          },
        },
      },
    },  
  }
})
//
const MuiThemeProvider = props => (  
  <ThemeProvider theme={theme}>
    <CssBaseline />   
    <Container 
      maxWidth='md' 
      sx={{
        bgcolor: 'grey.100'
      }}
    >
      {props.children}
    </Container>
  </ThemeProvider>
) 
// export const getMyTheme = () => theme;
export {
  MuiThemeProvider,
}
//
export default MuiThemeProvider
//
