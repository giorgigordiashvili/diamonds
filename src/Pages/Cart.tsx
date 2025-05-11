'use client';

import Billing from '@/components/Billing';
import Cartitems from '@/components/Cartitems';
import Data from '@/components/Data';
import Total from '@/components/Total';
import { useCart } from '@/context/CartContext';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { checkout, CheckoutData, CheckoutResponse } from '../api/cart';

const Main = styled.div`
  margin-top: 84px;
  width: 100%;
  padding-inline: 32px;
  margin-bottom: 100px;
  @media screen and (max-width: 600px) {
    padding-inline: 16px;
  }
`;

const Page = styled.div`
  margin-top: 52px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  @media screen and (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  background-color: #1a1a1a;
  width: 100%;
  height: fit-content;
  padding: 20px 36px;
  @media screen and (max-width: 600px) {
    padding-inline: 16px;
  }
`;

const Shopping = styled.div`
  width: 100%;
`;

const Pay = styled.button<{
  disabled?: boolean;
}>`
  width: 100%;
  background: linear-gradient(180deg, #c60000 0%, #840101 100%);
  height: 54px;
  text-align: center;
  border-radius: 10px;
  align-content: center;
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.56px;
  margin-top: 24px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  color: white;
  border: none;
`;

const Final = styled.div`
  width: 100%;
  padding: 36px 40px;
  background-color: #1a1a1a;
  height: fit-content;
  border: 1px solid #7d7d7d;
  border-top: unset;
  margin-bottom: 24px;
`;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isLoading } =
    useCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<CheckoutResponse | null>(null);

  const initialValues = {
    title: '',
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    createAccount: false,
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: '',
    isBillingSameAsShipping: true,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: '',
    paymentMethod: 'Cash', // Set default payment method to Cash
    notes: '',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    shippingStreet: Yup.string().required('Shipping street is required'),
    shippingCity: Yup.string().required('Shipping city is required'),
    shippingState: Yup.string().required('Shipping state/province is required'),
    shippingPostalCode: Yup.string().required('Shipping postal code is required'),
    shippingCountry: Yup.string().required('Shipping country is required'),
    isBillingSameAsShipping: Yup.boolean(),
    billingStreet: Yup.string().when('isBillingSameAsShipping', {
      is: false,
      then: (schema) => schema.required('Billing street is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    billingCity: Yup.string().when('isBillingSameAsShipping', {
      is: false,
      then: (schema) => schema.required('Billing city is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    billingState: Yup.string().when('isBillingSameAsShipping', {
      is: false,
      then: (schema) => schema.required('Billing state/province is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    billingPostalCode: Yup.string().when('isBillingSameAsShipping', {
      is: false,
      then: (schema) => schema.required('Billing postal code is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    billingCountry: Yup.string().when('isBillingSameAsShipping', {
      is: false,
      then: (schema) => schema.required('Billing country is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    // paymentMethod: Yup.string().required('Payment method is required'), // No longer a selection
    notes: Yup.string(),
  });

  if (isLoading) {
    return (
      <Main>
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading cart...</p>
      </Main>
    );
  }

  const cartCount = getCartCount();

  // Component to handle autofill logic
  const AutofillBillingAddress = () => {
    const { values, setFieldValue } = useFormikContext<typeof initialValues>();

    useEffect(() => {
      if (values.isBillingSameAsShipping) {
        setFieldValue('billingStreet', values.shippingStreet, false); // false to not trigger validation yet
        setFieldValue('billingCity', values.shippingCity, false);
        setFieldValue('billingState', values.shippingState, false);
        setFieldValue('billingPostalCode', values.shippingPostalCode, false);
        setFieldValue('billingCountry', values.shippingCountry, false);
      } else {
        // Optionally clear billing fields when unchecked, if desired
        // This might be better handled by Yup's `when` or by user explicitly clearing
        // For now, let's clear them for a cleaner UX if they uncheck after autofill
        setFieldValue('billingStreet', '', false);
        setFieldValue('billingCity', '', false);
        setFieldValue('billingState', '', false);
        setFieldValue('billingPostalCode', '', false);
        setFieldValue('billingCountry', '', false);
      }
    }, [
      values.isBillingSameAsShipping,
      values.shippingStreet,
      values.shippingCity,
      values.shippingState,
      values.shippingPostalCode,
      values.shippingCountry,
      setFieldValue,
    ]);

    return null; // This component does not render anything
  };

  const handleFormSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    setCheckoutError(null);
    setCheckoutSuccess(null);
    setSubmitting(true);

    const checkoutData: CheckoutData = {
      shippingAddress: {
        street: values.shippingStreet,
        city: values.shippingCity,
        state: values.shippingState,
        postalCode: values.shippingPostalCode,
        country: values.shippingCountry,
      },
      billingAddress: values.isBillingSameAsShipping
        ? {
            street: values.shippingStreet,
            city: values.shippingCity,
            state: values.shippingState,
            postalCode: values.shippingPostalCode,
            country: values.shippingCountry,
          }
        : {
            street: values.billingStreet,
            city: values.billingCity,
            state: values.billingState,
            postalCode: values.billingPostalCode,
            country: values.billingCountry,
          },
      paymentMethod: values.paymentMethod,
      notes: values.notes,
    };

    try {
      const response = await checkout(checkoutData);
      if (response.success) {
        setCheckoutSuccess(response);
        alert(`Order successful! Order ID: ${response.orderId}`);
      } else {
        setCheckoutError(response?.success || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(
        error instanceof Error ? error.message : 'An unexpected error occurred during checkout.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Main>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Your Shopping Cart{' '}
        {cartCount > 0 ? `(${cartCount} item${cartCount > 1 ? 's' : ''})` : 'is empty'}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <AutofillBillingAddress />
            <Page>
              <Left>
                {/* <Customer /> */}
                <Data />
                <Billing />
                <div
                  style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#222',
                    borderRadius: '4px',
                  }}
                >
                  <h3
                    style={{
                      borderBottom: '1px solid #444',
                      paddingBottom: '10px',
                      marginBottom: '15px',
                    }}
                  >
                    Payment Method
                  </h3>
                  <div className="form-field">
                    <p>Payment Method: Cash</p> {/* Display Cash as the payment method */}
                    {/* Hidden field to include paymentMethod in form values if necessary, though it's fixed */}
                    <Field type="hidden" name="paymentMethod" value="Cash" />
                  </div>
                  <div className="form-field" style={{ marginTop: '15px' }}>
                    <label htmlFor="notes">Order Notes (Optional)</label>
                    <Field
                      as="textarea"
                      name="notes"
                      id="notes"
                      placeholder="Any special instructions?"
                      style={{
                        backgroundColor: '#262626',
                        width: '100%',
                        outline: 'none',
                        border: '1px solid #444',
                        padding: '12px',
                        color: '#fff',
                        borderRadius: '4px',
                        minHeight: '80px',
                      }}
                    />
                    <ErrorMessage name="notes" component="div" />
                  </div>
                </div>
              </Left>
              <Shopping>
                <Cartitems
                  items={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
                <Final>
                  <Total totalAmount={getCartTotal()} />
                </Final>
                <Pay type="submit" disabled={isSubmitting || cartCount === 0}>
                  {isSubmitting ? 'PROCESSING...' : 'PAY AND ORDER'}
                </Pay>
                {checkoutError && (
                  <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                    Error: {checkoutError}
                  </p>
                )}
                {checkoutSuccess && checkoutSuccess.orderId && (
                  <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
                    Order placed successfully! Order ID: {checkoutSuccess.orderId}
                  </p>
                )}
              </Shopping>
            </Page>
          </Form>
        )}
      </Formik>
    </Main>
  );
};

export default Cart;
