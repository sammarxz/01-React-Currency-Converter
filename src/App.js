import React from 'react'

import CurrencyField from './components/CurrencyField'
import BarChartComponent from './components/BarChartComponent'

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

    this.generateGraphData()
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

      this.setState({
        from,
        to,
      })

      this.generateGraphData()
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

  getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate()
  }

  getMonthRange = (month, year, days, limit) => {
    let datesArray = []

    if (limit) {
      days = limit
    }

    for (let day = 1; day <= days; day++) {
      // criar um array de datas
      datesArray.push([`${year}-${month}-${day}`])
    }

    return datesArray
  }

  generateGraphData = () => {
    const { from, to } = this.state

    const actualDate = new Date()

    const prevMonth = actualDate.getMonth()
    const actualMonth = actualDate.getMonth() + 1
    const actualYear = actualDate.getFullYear()
    const actualDay = actualDate.getDay()

    const daysInPrevMonth = this.getDaysInMonth(prevMonth, actualYear)
    const daysInactualMonth = this.getDaysInMonth(actualMonth, actualYear)

    const dates = this.getMonthRange(prevMonth, actualYear, daysInPrevMonth).concat(
      this.getMonthRange(actualMonth, actualYear, daysInactualMonth, actualDay)
    )

    let dataLabels = []
    let dataPrice = []

    dates.forEach((date) => {
      const URL = `https://api.ratesapi.io/api/${date}?base=${from}&symbols=${to}`
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
          },
        ],
      },
    })
  }

  render() {
    const { fromValue, toValue, Data } = this.state

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
        <div className="chart">
          <h1 className="fw--light">Exchange rate</h1>
          {Data ? <BarChartComponent data={Data} /> : <>Loading</>}
        </div>
      </main>
    )
  }
}

export default App
