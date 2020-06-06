import React from 'react'

import CurrencyField from './components/CurrencyField'

class App extends React.Component {
  state = {
    from: 'BRL',
    to: 'USD',
    fromValue: 1,
    toValue: '',
    timer: null,
  }

  componentDidMount() {
    if (this.state.fromValue) {
      this.convert()
    }
  }

  setAmount = (type, value) => {
    const { timer } = this.state

    clearTimeout(timer)

    this.setState({
      [type]: value,
      // Only make the call to api when the user stops typing
      timer: setTimeout(() => this.convert(type), 1000),
    })
  }

  convert = (type) => {
    let { from, to } = this.state

    // Invert
    if (type === 'toValue') {
      from = 'USD'
      to = 'BRL'
    }

    const { fromValue, toValue } = this.state
    const URL = `https://api.ratesapi.io/api/latest?base=${from}&symbols=${to}`

    fetch(URL)
      .then((res) => res.json())
      .then((json) => {
        let price = json['rates'][to]
        let coin = 0

        if (type === 'toValue') {
          coin = (parseFloat(toValue) * price).toFixed(2)
          this.setState({
            fromValue: coin,
          })
          return
        }

        coin = (parseFloat(fromValue) * price).toFixed(2)
        this.setState({
          toValue: coin,
        })
      })
  }

  render() {
    const { fromValue, toValue } = this.state

    return (
      <main className="container">
        <div className="currency-converter d--flex a--center">
          <CurrencyField
            label="Amount"
            name="amount"
            currency="BRL"
            value={fromValue}
            setValue={(value) => this.setAmount('fromValue', value)}
          />
          <CurrencyField
            label="Converted to"
            name="converted"
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
