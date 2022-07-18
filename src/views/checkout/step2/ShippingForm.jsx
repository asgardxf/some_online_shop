/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput, CustomMobileInput } from 'components/formik';
import {Field, Form, useFormikContext} from 'formik';
import React from 'react';
import ShippingTotal from "./ShippingTotal";
import {CHECKOUT_STEP_1, CHECKOUT_STEP_3} from "../../../constants/routes";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";

import { useHistory } from 'react-router-dom';
import withCheckout from "../hoc/withCheckout";


const F = (props) => {
  return <div className="d-block checkout-field">
    <div className="input-group">
      {props.hint && <span className="label-input label-error">{props.hint}</span>}
      <input
        type="text" className="input-form"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        //style="text-transform: capitalize;"
      />
    </div>
  </div>
}

const ShippingForm = withCheckout((props) => {
  const { values, setValues } = props;
  const history = useHistory();
  const setValue = (name, value) => {
    setValues(v => {
      return {
        ...v,
        [name]: value
      }
    })
  }
  return (
    <>
    <div className="checkout-shipping-wrapper">
      <div className="checkout-shipping-form">
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <F value={values.name} placeholder="Введите имя" onChange={(e) => {
              setValue('name', e.target.value)
            }}/>
            {/*<Field
              name="fullname"
              type="text"
              label="* Имя"
              placeholder="Введите имя"
              component={CustomInput}
              style={{ textTransform: 'capitalize' }}
            />*/}
          </div>
          <div className="d-block checkout-field">
            <F value={values.phone} placeholder="Введите телефон" onChange={(e) => {
              setValue('phone', e.target.value)
            }}/>
            {/*<Field
              name="phone"
              type="phone"
              label="* Телефон"
              placeholder="Введите телефон"
              component={CustomInput}
            />*/}
          </div>
        </div>
      </div>
    </div>
      <br />
      {/*  ---- TOTAL --------- */}
      <ShippingTotal subtotal={props.subtotal} />
      <br />
      {/*  ----- NEXT/PREV BUTTONS --------- */}
      <div className="checkout-shipping-action">
        <button
          className="button button-muted"
          onClick={() => history.push(CHECKOUT_STEP_1)}
          type="button"
        >
          <ArrowLeftOutlined />
          &nbsp;
          Go Back
        </button>
        <button
          className="button button-icon"
          onClick={() => {
            console.log(values, 222)
            window.checkout = {
              ...values,
            }
            history.push(CHECKOUT_STEP_3);
          }}
        >
          Next Step
          &nbsp;
          <ArrowRightOutlined />
        </button>
      </div>
      </>
  );
});

export default ShippingForm;
