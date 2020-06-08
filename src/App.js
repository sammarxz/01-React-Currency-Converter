import React from 'react'

import CurrencyField from './components/CurrencyField'
import BarChartComponent from './components/BarChartComponent'
import Button from './components/Button'

class App extends React.Component {
  state = {
    from: 'BRL',
    to: 'USD',
    fromValue: 1,
    toValue: '',
    timer: null,
    apiBase: 'https://api.ratesapi.io/api/',
  }

  componentDidMount() {
    this.convert()
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

  toFixed = (num, fixed) => {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
    return num.toString().match(re)[0]
  }

  convert = (type) => {
    let { from, to } = this.state

    // Invert
    if (type === 'toValue') {
      from = 'USD'
      to = 'BRL'
    }

    this.setState({
      fromBase: from,
      toBase: to,
    })

    this.generateGraphData(from, to)

    const { fromValue, toValue, apiBase } = this.state
    const URL = `${apiBase}latest?base=${from}&symbols=${to}`

    fetch(URL)
      .then((res) => res.json())
      .then((json) => {
        let price = json['rates'][to]
        let coin = 0

        this.setState({
          baseToValue: this.toFixed(price, 2),
        })

        if (type === 'toValue') {
          coin = this.toFixed(parseFloat(toValue) * price, 2)
          this.setState({
            fromValue: coin,
          })
          return
        }

        coin = this.toFixed(parseFloat(fromValue) * price, 2)
        this.setState({
          toValue: coin,
        })
      })
  }

  getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate()
  }

  getMonthRange = (month, year, days, limit) => {
    let datesArray = []

    if (limit) {
      days = limit
    }

    for (let day = 1; day <= days; day++) {
      // create dates array
      datesArray.push([`${year}-${month}-${day}`])
    }

    return datesArray
  }

  generateGraphData = (from, to) => {
    const actualDate = new Date()

    const prevMonth = actualDate.getMonth()
    const actualMonth = actualDate.getMonth() + 1
    const actualYear = actualDate.getFullYear()
    const actualDay = actualDate.getDate()

    const daysInPrevMonth = this.getDaysInMonth(prevMonth, actualYear)
    const daysInactualMonth = this.getDaysInMonth(actualMonth, actualYear)

    const dates = this.getMonthRange(prevMonth, actualYear, daysInPrevMonth).concat(
      this.getMonthRange(actualMonth, actualYear, daysInactualMonth, actualDay)
    )

    let dataLabels = []
    let dataPrice = []

    const { apiBase } = this.state

    dates.forEach((date) => {
      const URL = `${apiBase}${date}?base=${from}&symbols=${to}`
      fetch(URL)
        .then((res) => res.json())
        .then((json) => {
          let price = parseFloat(json['rates'][to])
          dataLabels.push(date)
          dataPrice.push(price)
        })
    })

    this.setState({
      Data: {
        labels: dataLabels,
        datasets: [
          {
            label: 'Price',
            data: dataPrice,
            backgroundColor: '#5755d9',
            showXLabels: 10,
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 9,
            minBarLength: 3,
          },
        ],
      },
    })
  }

  render() {
    const { from, to, fromValue, toValue, Data, fromBase, toBase, baseToValue } = this.state

    return (
      <main className="container">
        <div className="currency-converter d--flex a--center j--spaceBetween">
          <CurrencyField
            label="Amount"
            name="amount"
            currency={from}
            value={fromValue}
            setValue={(value) => this.setAmount('fromValue', value)}
          />
          <CurrencyField
            label="Converted to"
            name="converted"
            currency={to}
            value={toValue}
            setValue={(value) => this.setAmount('toValue', value)}
          />
        </div>
        <div className="chart">
          <div className="chart__header d--flex a--center j--spaceBetween mb--40">
            <h1 className="fw--light">Exchange rate</h1>
            <div className="chart__header__rate">
              <p className="fw--medium">
                1 {fromBase} = {baseToValue} {toBase}
              </p>
            </div>
          </div>
          {Data ? <BarChartComponent data={Data} /> : <>Loading</>}
        </div>
      </main>
    )
  }
}

export default App
