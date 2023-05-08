// These must be the first lines in src/index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
//
// material-ui
import MuiThemeProvider from './utils/MuiThemeProvider'
//
// react router
import { 
  Routes,
  BrowserRouter, 
  Route,
  // Navigate, 
  // Redirect 
} from 'react-router-dom';
//
// apps and forms
import FormikWizard from './components/FormikWizard';
import { appConfigs } from './utils/AppConfig';
//
// import { Route } from 'react-router-dom';
// import getFormikApps from './apps/FormikApps';
//
import './index.css';
//

// 220427 - remove magic variable debug, rely on environment variables, update theme export

ReactDOM.render(  
  <StrictMode>    
    <MuiThemeProvider>
      <BrowserRouter>   
        <Routes>         
          {Object.keys( appConfigs ).map( path => {            
            return (
              <Route 
                key={path} 
                path={path} 
                // 220516 - remove location.pathname from formikwizard props
                // element={ <FormikWizard stepNames={appConfigs[path].pages} apiPath={appConfigs[path].apiPath} /> }
                element={ <FormikWizard stepNames={appConfigs[path].pages} apiPath={appConfigs[path].apiPath} path={path} /> }
              />                
            )
          })}
        </Routes>
      </BrowserRouter>
    </MuiThemeProvider>    
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


