
import React from "react"
import PropTypes from "prop-types"
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Password } from 'primereact/password'
import styles from "./InputControl.module.css"


function InputControl({ label, type, options, ...props }) {
  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      {type === "dropdown" ? (
        <Dropdown
          value={props.value}
          options={options}
          onChange={(e) => props.onChange(e.value)}
          placeholder={props.placeholder}
        />
      ): (
        
        type === "password" ? (  
          <InputText type="password" {...props} />
        ) : (
        <InputText type={props.type} {...props} />
        )
      )}
    </div>
  )
}

InputControl.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(["text", "password","dropdown"]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
}

export default InputControl




