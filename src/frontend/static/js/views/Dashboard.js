import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
        this.js();
    }

    async js() {

    }
    async getSchedule(date) {
        const query = `
        query HeatingSchedule($date: String!) {
            heatingSchedule(date: $date) {
              startTime
              endTime
              level
              heatingCartridge
              total
              energy
              tax
            }
          }
    `;
    
    const options = {
        method: "post",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        query: query,
        variables: {
            date,
        }
        })
    };
    
    const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
    return resp.data.heatingSchedule
    }

    async getRoomInfo() {
        const query = `
        query ThermostatInfo {
            thermostatInfo {
              name
              roomTemperature
              setpoint
              heatOutputPercentage
              allowHeating
            }
          }
    `;
    
    const options = {
        method: "post",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        query: query,
        })
    };
    
    const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
    return resp.data.thermostatInfo
    }

    async renderCharts() {
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const schedule = await this.getSchedule(dateStr);
        const prices = schedule.map((e) => ((e.total * 100).toFixed(1)));
        console.log((new Date().getHours() + new Date().getMinutes() / 60).toString());
        var lineOptions = {
            stroke: {
                curve: 'stepline',
                width: 3,
            },
            chart: {
                width: '100%',
                height: 250,
                toolbar: {
                    show: false,
                  },
                type: 'line',
            },
            series: [
              {
                name: '',
                data: prices
              }
            ],
            annotations: {
                xaxis: [
                  {
                    x: new Date().getHours().toString(),
                    borderColor: '#feb019',
                    label: {
                        style: {
                        color: '#fff',
                      },
                    }
                  }
                ]
              },
            xaxis: {
                tickAmount: 12,
                labels: {
                    style: {
                        colors: '#d3d3d3',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 400,
                    },
                    rotate: 0,
                },
                categories: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23', '24'],
                tooltip: {
                    enabled: false,
                }
            },
            yaxis: {
                labels: {
                    show: true,
                    align: 'right',
                    minWidth: 0,
                    maxWidth: 25,
                    style: {
                        colors: '#d3d3d3',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 400,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                    formatter: (value) => { return value.toFixed(0) },
                },
            },
            tooltip: {
                enabledOnSeries: false,
                shared: true,
                followCursor: false,
                intersect: false,
                inverseOrder: false,
                custom: undefined,
                style: {
                    fontSize: '11px',
                    fontFamily: 'monospace'
                },
                x: {
                    formatter: (value) => (`${value - 1}:00-${value === 24 ? 0 : value}:00`),
                },
                y: {
                    formatter: (value) => (value + ' öre'),
                },
            }
        }
        var chart = new ApexCharts(document.querySelector('#chart'), lineOptions)
        chart.render()
        
        const roomInfo = await this.getRoomInfo();
        const rooms = roomInfo.map((e) => (e.name));
        const temperature = roomInfo.map((e) => (e.roomTemperature));
        const setpoint = roomInfo.map((e) => (e.setpoint));
        const heatOutputPercentage = roomInfo.map((e) => (e.heatOutputPercentage));
        const maxValue = Math.max(...temperature, ...setpoint);
        const yAxisMaxValue = Math.max(Math.ceil(maxValue * 1.1), 25);
        var roomOptions = {
            series: [
                {
                    name: 'Temperature',
                    data: temperature,
                },
                {
                    name: 'Setpoint',
                    data: setpoint, 
                },
                {
                    name: 'Heating',
                    data: heatOutputPercentage
                }
            ],
            chart: {
                foreColor: '#fff',
                width: '100%',
                type: 'bar',
                height: 250,
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                labels: {
                    colors: '#d3d3d3',
                },
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 400,
            },
            markers: {
                size: 0,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                labels: {
                    style: {
                        colors: '#d3d3d3',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 400,
                    },
                    rotate: -35,
                },
            categories: rooms,
            },
            yaxis: [
                {
                    seriesName: 'Temperature',
                    minWidth: 0,
                    maxWidth: 25,
                    min: 0,
                    max: yAxisMaxValue,
                    labels: {
                        style: {
                            colors: '#d3d3d3',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            fontWeight: 400,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                        formatter: (value) => { return value.toFixed(0) },
                    },
                },
                {
                    seriesName: 'Setpoint',
                    min: 0,
                    max: yAxisMaxValue,
                    show: false
                },
                {
                    seriesName: 'Heating',
                    opposite: true,
                    minWidth: 0,
                    maxWidth: 25,
                    min: 0,
                    max: 100,
                    labels: {
                        style: {
                            colors: '#d3d3d3',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            fontWeight: 400,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                        formatter: (value) => { return value.toFixed(0) },
                    },

            }
        ],
            fill: {
            opacity: 1
            },
            tooltip: {
            y: {
                formatter: function (val) {
                return val + " C"
                }
            }
            }
            };
  
        var roomChart = new ApexCharts(document.querySelector("#roomChart"), roomOptions);
        roomChart.render()
    }

    async render() {
        this.container.innerHTML = await this.getHtml();
        this.renderCharts();
    }

    async getHtml() {
        return `
        <div id="chart" class="Chart">
        </div>
        </br>
        <div id="roomChart" class="Chart">
        </div>
        `;
    }
}