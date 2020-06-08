import React from 'react'

const Button = ({ label, type, className, onClick, icon, iconAlt }) => {
  return (
    <button
      className={`btn btn__${type} ${icon ? 'btn__icon' : ''} ${className ? className : ''}`}
      onClick={onClick}
    >
      {icon && <img src={icon} alt={iconAlt} />}
      <span>{label}</span>
    </button>
  )
}

export default Button
