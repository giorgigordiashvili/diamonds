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
  /* Renamed from Form to avoid conflict */
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
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

const Privacy = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  p:nth-child(1) {
    /* More specific selector for Privacy title */
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
  }
  p:nth-child(2) {
    color: rgb(168, 168, 168);
    font-size: 14px;
    letter-spacing: 0px;
    line-height: 20px;
  }
  p:nth-child(3) {
    color: rgb(168, 168, 168);
    font-size: 12px;
    letter-spacing: 0.1px;
    line-height: 12px;
  }
`;

const Billing = () => {
  return (
    <Main>
      <Head>
        <div></div>
        <p>Billing Address</p>
        <div></div>
      </Head>

      <div
        className="form-field"
        style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
      >
        <Field type="checkbox" name="isBillingSameAsShipping" id="isBillingSameAsShipping" />
        <label htmlFor="isBillingSameAsShipping" style={{ marginBottom: 0 }}>
          Billing address is the same as shipping address.
        </label>
      </div>

      <StyledForm>
        {/* Billing Street */}
        <div className="form-field full-width">
          <label htmlFor="billingStreet">Street and Housenumber *</label>
          <Field
            type="text"
            name="billingStreet"
            id="billingStreet"
            placeholder="Street and Housenumber"
          />
          <ErrorMessage name="billingStreet" component="div" className="error-message" />
        </div>

        {/* Billing City */}
        <div className="form-field">
          <label htmlFor="billingCity">City *</label>
          <Field type="text" name="billingCity" id="billingCity" placeholder="City" />
          <ErrorMessage name="billingCity" component="div" className="error-message" />
        </div>

        {/* Billing State/Province */}
        <div className="form-field">
          <label htmlFor="billingState">State/Province *</label>
          <Field type="text" name="billingState" id="billingState" placeholder="State/Province" />
          <ErrorMessage name="billingState" component="div" className="error-message" />
        </div>

        {/* Billing Postal Code */}
        <div className="form-field">
          <label htmlFor="billingPostalCode">Postal Code *</label>
          <Field
            type="text"
            name="billingPostalCode"
            id="billingPostalCode"
            placeholder="Postal Code"
          />
          <ErrorMessage name="billingPostalCode" component="div" className="error-message" />
        </div>

        {/* Billing Country */}
        <div className="form-field">
          <label htmlFor="billingCountry">Country *</label>
          <Field type="text" name="billingCountry" id="billingCountry" placeholder="Country" />
          <ErrorMessage name="billingCountry" component="div" className="error-message" />
        </div>
      </StyledForm>

      <Privacy>
        <p>Privacy</p>
        <p>
          By selecting continue you confirm that you have read our data protection information and
          accepted our general terms and conditions.
        </p>
        <p>*Compulsory fields</p>
      </Privacy>
    </Main>
  );
};

export default Billing;
