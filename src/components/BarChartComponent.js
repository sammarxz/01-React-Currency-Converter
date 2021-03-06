import React from 'react'
import { Bar } from 'react-chartjs-2'

const BarChartComponent = ({ data }) => {
  return (
    <>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem) {
                return `R$ ${tooltipItem.yLabel.toFixed(2)}`
              },
            },
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  offsetGridLines: false,
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  maxTicksLimit: 10,
                },
              },
            ],
          },
        }}
      />
    </>
  )
}

export default BarChartComponent
