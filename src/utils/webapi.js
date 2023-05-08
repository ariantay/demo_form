

// import React from 'react';

import axios from 'axios';
//
import getEnvironmentVariables from './EnvironmentVariables';
//
// 220514 - get submitSuccess and submitError message from AppConfig
import { appConfigs } from './AppConfig'
const production =  getEnvironmentVariables().isProduction;
const baseURL = getEnvironmentVariables().baseURL;
//
const getSubmitSuccess = apiPath => {
  // 220516 - use object.values to get config
  const config = Object.values( appConfigs ).find( config => config?.apiPath===apiPath );
  return config?.submitSuccess;
}
//
const getSubmitError = apiPath => {
  const config = Object.values( appConfigs ).find( config => config?.apiPath===apiPath );
  return config?.submitError;
}
const api = axios.create({
  baseURL: `${baseURL}/form` ,
  method: 'POST',
  headers: {'Content-Type': 'multipart/form-data'},
})

api.interceptors.request.use( 
  config => {
    if ( !production ) {
      console.log(`request.success:\n`, `config.baseURL: ${config.baseURL}, config.url: ${config.url}`);
      if (config.data&&config.data.entries()) {        
        for(let pair of config.data.entries()) {          
          console.log(`${pair[0]}: ${pair[0]==='files'? pair[1].name : pair[1]}`);
        }
      }
    }
    return config;
  },
  // 220514 - error when creating request
  error => {    
    error.defaultError = `Failed to create request`;
    if ( !production ) {
      console.log( 'request.error', error )
    }    
    return Promise.reject( error );
  }
)
//
api.interceptors.response.use( 
  response => {
    response.successMessage = getSubmitSuccess( response.config?.url ) || 'default success message';
    if (!production) {console.log('response.success', response)}    
    return response;
  },
  error => { 
    error.defaultError = ( error.response?.status && getSubmitError( error.config?.url ) ) || '\nreCAPTCHA validation timed out.\n\nPlease try again.';
    if ( !production ) {
      console.log( 'response.error', error )
    }      
    return Promise.reject( error );
  }
)

export { 
  api,
};
//
export default api;
//