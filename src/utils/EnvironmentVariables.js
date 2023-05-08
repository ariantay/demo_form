

//https://create-react-app.dev/docs/adding-custom-environment-variables/
//

// 220207 - have environment variables defined in one source
//
// vars defined in package.json and Jenkinsfile
//
// 220324 - REACT_APP_ENV is set in package.json, NODE_ENV is set to dev/prod depending on npm start/npm build
// 220324 - NODE_ENV does NOT determine environment UNLESS REACT_APP_ENV is null/missing
//
function getEnvironmentVariables() {  
  const { REACT_APP_BUILD, REACT_APP_ENV, NODE_ENV } = process.env;  
  const docURL = 'https://demo/api/GetFile';
  const docID = 'svcreq';
  const sitekey_invis = (REACT_APP_ENV||NODE_ENV) === 'production' ? 'xxxx' : 'xxxx';
  const baseURL = (REACT_APP_ENV||NODE_ENV) === 'production' ? 'https://demo/api/servicerequest' : 'https://demo/api/servicerequest';  
  const isProduction = (REACT_APP_ENV||NODE_ENV) === 'production';
  //
  return (
    { REACT_APP_BUILD, REACT_APP_ENV, NODE_ENV, baseURL, docURL, docID, sitekey_invis, isProduction }
  )
  //
}
//
export {
  getEnvironmentVariables,
}
//
export default getEnvironmentVariables;
//