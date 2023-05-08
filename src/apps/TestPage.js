
import FormikWizard from '../components/FormikWizard';

const stepNames = ['FileUpload','AddressInfo','ContactInfo','HouseHoldInfo','ReviewEntries']
const apiPath = 'noAPI'

const TestPage = props => <FormikWizard stepNames={stepNames} apiPath={apiPath} path={props.path} />

export {
  TestPage,
}

export default TestPage
