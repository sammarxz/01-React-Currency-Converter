import React from 'react'

import CurrencyField from './components/CurrencyField'

class App extends React.Component {
  state = {
    fromValue: '',
    toValue: '',
    timer: null,
  }

  setAmount = (type, value) => {
    const { timer } = this.state

    clearTimeout(timer)

    this.setState({
      [type]: value,
      timer: setTimeout(this.convert, 1000),
    })
  }

  convert = () => {
    const { fromValue } = this.state
    // TODO: make the convertition
    console.log(fromValue)
  }

  render() {
    const { fromValue, toValue } = this.state

    return (
      <main className="container">
        <div className="currency-converter d--flex a--center">
          <CurrencyField
            label="Amount"
            currency="BRL"
            value={fromValue}
            setValue={(value) => this.setAmount('fromValue', value)}
          />
          <CurrencyField
            label="Converted to"
            currency="USD"
            value={toValue}
            setValue={(value) => this.setAmount('toValue', value)}
          />
        </div>
      </main>
    )
  }
}

export default App
