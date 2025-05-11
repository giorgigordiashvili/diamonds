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

interface DataProps {
  dictionary: any;
}

const Data: React.FC<DataProps> = ({ dictionary }) => {
  const { data } = dictionary.cart;

  return (
    <Main>
      <Head>
        <div></div>
        <p>{data.title}</p>
        <div></div>
      </Head>
      <StyledForm>
        {/* Title (Optional) */}
        <div className="form-field">
          <label htmlFor="title">{data.labels.title}</label>
          <Field as="select" name="title" id="title" placeholder={data.placeholders.title}>
            <option value="">{data.placeholders.title}</option>
            <option value="Mr">{data.options.title.mr}</option>
            <option value="Ms">{data.options.title.ms}</option>
            <option value="Mrs">{data.options.title.mrs}</option>
            <option value="Dr">{data.options.title.dr}</option>
            <option value="Other">{data.options.title.other}</option>
          </Field>
          <ErrorMessage name="title" component="div" className="error-message" />
        </div>

        {/* Company (Optional) */}
        <div className="form-field">
          <label htmlFor="company">{data.labels.company}</label>
          <Field type="text" name="company" id="company" placeholder={data.placeholders.company} />
          <ErrorMessage name="company" component="div" className="error-message" />
        </div>

        {/* First Name */}
        <div className="form-field">
          <label htmlFor="firstName">{data.labels.firstName}</label>
          <Field
            type="text"
            name="firstName"
            id="firstName"
            placeholder={data.placeholders.firstName}
          />
          <ErrorMessage name="firstName" component="div" className="error-message" />
        </div>

        {/* Last Name */}
        <div className="form-field">
          <label htmlFor="lastName">{data.labels.lastName}</label>
          <Field
            type="text"
            name="lastName"
            id="lastName"
            placeholder={data.placeholders.lastName}
          />
          <ErrorMessage name="lastName" component="div" className="error-message" />
        </div>

        {/* Email */}
        <div className="form-field full-width">
          <label htmlFor="email">{data.labels.email}</label>
          <Field type="email" name="email" id="email" placeholder={data.placeholders.email} />
          <ErrorMessage name="email" component="div" className="error-message" />
        </div>

        {/* Phone Number */}
        <div className="form-field full-width">
          <label htmlFor="phone">{data.labels.phone}</label>
          <Field type="text" name="phone" id="phone" placeholder={data.placeholders.phone} />
          <ErrorMessage name="phone" component="div" className="error-message" />
        </div>

        {/* Shipping Street */}
        <div className="form-field full-width">
          <label htmlFor="shippingStreet">{data.labels.shippingStreet}</label>
          <Field
            type="text"
            name="shippingStreet"
            id="shippingStreet"
            placeholder={data.placeholders.shippingStreet}
          />
          <ErrorMessage name="shippingStreet" component="div" className="error-message" />
        </div>

        {/* Shipping City */}
        <div className="form-field">
          <label htmlFor="shippingCity">{data.labels.shippingCity}</label>
          <Field
            type="text"
            name="shippingCity"
            id="shippingCity"
            placeholder={data.placeholders.shippingCity}
          />
          <ErrorMessage name="shippingCity" component="div" className="error-message" />
        </div>

        {/* Shipping State/Province */}
        <div className="form-field">
          <label htmlFor="shippingState">{data.labels.shippingState}</label>
          <Field
            type="text"
            name="shippingState"
            id="shippingState"
            placeholder={data.placeholders.shippingState}
          />
          <ErrorMessage name="shippingState" component="div" className="error-message" />
        </div>

        {/* Shipping Postal Code */}
        <div className="form-field">
          <label htmlFor="shippingPostalCode">{data.labels.shippingPostalCode}</label>
          <Field
            type="text"
            name="shippingPostalCode"
            id="shippingPostalCode"
            placeholder={data.placeholders.shippingPostalCode}
          />
          <ErrorMessage name="shippingPostalCode" component="div" className="error-message" />
        </div>

        {/* Shipping Country */}
        <div className="form-field">
          <label htmlFor="shippingCountry">{data.labels.shippingCountry}</label>
          <Field
            type="text"
            name="shippingCountry"
            id="shippingCountry"
            placeholder={data.placeholders.shippingCountry}
          />
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
          {data.labels.createAccount}
        </label>
        <ErrorMessage name="createAccount" component="div" className="error-message" />
      </div>
    </Main>
  );
};

export default Data;
