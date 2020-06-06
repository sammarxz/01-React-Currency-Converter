import React from 'react'

const CurrencyField = ({ label, name, currency, value, setValue }) => {
  return (
    <div className="input-wrapper p--relative d--inlineBlock" tabIndex="1">
      <div className="currency-flag d--flex a--center">
        <img src={`./img/${currency}.png`} alt={currency} />
        <span className="fw--medium">{currency}</span>
      </div>
      <label for={name} className="fw--medium">
        {label}
      </label>
      <input
        type="number"
        name={name}
        id={name}
        value={value}
        onChange={(e) => setValue((value = e.target.value))}
        className="fw--medium"
      />
    </div>
  )
}

export default CurrencyField
