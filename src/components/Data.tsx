'use client';
import { ErrorMessage, Field } from 'formik';
import styled from 'styled-components';

const Main = styled.div`
  width: 100%;
  height: fit-content;
  margin-bottom: 20px;
`;
const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* Adjusted for better centering */
  width: 100%;
  text-align: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px; /* Added margin */

  div {
    background-color: white;
    height: 2px;
  }

  p {
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap; /* Prevent title from wrapping */
  }
`;
const StyledForm = styled.div`
  /* Renamed from Form to avoid conflict with Formik's Form */
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
  /* Adjusted grid to be more flexible, 2 columns for most inputs */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px 16px; /* row-gap column-gap */
  color: #d4d4d4;

  .form-field {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 5px;
    font-size: 14px;
  }

  input,
  select {
    /* Apply original input styling */
    background-color: #262626;
    width: 100%;
    outline: none;
    border: none; /* Reverted: remove border */
    padding: 12px;
    color: #fff; /* Keep text color for visibility */
    /* border-radius: 4px; */ /* Reverted: remove border-radius */
  }

  .full-width {
    grid-column: 1 / -1; /* Span full width */
  }

  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
`;

// Define the props for the Data component if it needs to receive Formik context or specific field names
// For now, assuming field names are hardcoded as they are specific to this section
// interface DataProps {
//   formik: any; // or more specific FormikProps<YourFormValues>
// }

const Data = () => {
  // This component will now render Formik <Field> components.
  // The actual <Formik> and <Form> tags will be in Cart.tsx.

  return (
    <Main>
      <Head>
        <div></div>
        <p>Your Data & Shipping Address</p>
        <div></div>
      </Head>
      <StyledForm>
        {/* Title (Optional) */}
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <Field as="select" name="title" id="title">
            <option value="">Select Title</option>
            <option value="Mr">Mr.</option>
            <option value="Ms">Ms.</option>
            <option value="Mrs">Mrs.</option>
            <option value="Dr">Dr.</option>
            <option value="Other">Other</option>
          </Field>
          <ErrorMessage name="title" component="div" className="error-message" />
        </div>

        {/* Company (Optional) */}
        <div className="form-field">
          <label htmlFor="company">Company (Optional)</label>
          <Field type="text" name="company" id="company" placeholder="Company" />
          <ErrorMessage name="company" component="div" className="error-message" />
        </div>

        {/* First Name */}
        <div className="form-field">
          <label htmlFor="firstName">First Name *</label>
          <Field type="text" name="firstName" id="firstName" placeholder="First Name" />
          <ErrorMessage name="firstName" component="div" className="error-message" />
        </div>

        {/* Last Name */}
        <div className="form-field">
          <label htmlFor="lastName">Last Name *</label>
          <Field type="text" name="lastName" id="lastName" placeholder="Last Name" />
          <ErrorMessage name="lastName" component="div" className="error-message" />
        </div>

        {/* Email */}
        <div className="form-field full-width">
          <label htmlFor="email">Email Address *</label>
          <Field type="email" name="email" id="email" placeholder="Your Email Address" />
          <ErrorMessage name="email" component="div" className="error-message" />
        </div>

        {/* Phone Number */}
        <div className="form-field full-width">
          <label htmlFor="phone">Phone Number *</label>
          <Field type="text" name="phone" id="phone" placeholder="Phone Number" />
          <ErrorMessage name="phone" component="div" className="error-message" />
        </div>

        {/* Shipping Address Section Title (Optional visual cue) */}
        {/* <div className="full-width" style={{ marginTop: '20px', marginBottom: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
          <p style={{fontSize: '16px', fontWeight: '500'}}>Shipping Address</p>
        </div> */}

        {/* Shipping Street */}
        <div className="form-field full-width">
          <label htmlFor="shippingStreet">Street and Housenumber *</label>
          <Field
            type="text"
            name="shippingStreet"
            id="shippingStreet"
            placeholder="Street and Housenumber"
          />
          <ErrorMessage name="shippingStreet" component="div" className="error-message" />
        </div>

        {/* Shipping City */}
        <div className="form-field">
          <label htmlFor="shippingCity">City *</label>
          <Field type="text" name="shippingCity" id="shippingCity" placeholder="City" />
          <ErrorMessage name="shippingCity" component="div" className="error-message" />
        </div>

        {/* Shipping State/Province */}
        <div className="form-field">
          <label htmlFor="shippingState">State/Province *</label>
          <Field type="text" name="shippingState" id="shippingState" placeholder="State/Province" />
          <ErrorMessage name="shippingState" component="div" className="error-message" />
        </div>

        {/* Shipping Postal Code */}
        <div className="form-field">
          <label htmlFor="shippingPostalCode">Postal Code *</label>
          <Field
            type="text"
            name="shippingPostalCode"
            id="shippingPostalCode"
            placeholder="Postal Code"
          />
          <ErrorMessage name="shippingPostalCode" component="div" className="error-message" />
        </div>

        {/* Shipping Country */}
        <div className="form-field">
          <label htmlFor="shippingCountry">Country *</label>
          <Field type="text" name="shippingCountry" id="shippingCountry" placeholder="Country" />
          {/* Consider making this a select if you have a predefined list */}
          <ErrorMessage name="shippingCountry" component="div" className="error-message" />
        </div>
      </StyledForm>

      {/* Create Account Checkbox */}
      <div
        className="form-field"
        style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}
      >
        <Field type="checkbox" name="createAccount" id="createAccount" />
        <label htmlFor="createAccount" style={{ marginBottom: 0 }}>
          Create a customer account.
        </label>
        <ErrorMessage name="createAccount" component="div" className="error-message" />
      </div>
    </Main>
  );
};

export default Data;
