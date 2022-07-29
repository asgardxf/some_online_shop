import React from "react";

const TextField = (props) => {
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
};

const TextFieldWrapped = (props) => {
  return <TextField
    {...props}
    onChange={(event) => {
      props.onChange(event.target.value)
    }}
  />
}


export default {
  TextField,
  TextFieldWrapped,
}