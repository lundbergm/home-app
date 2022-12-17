import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
        this.js();
    }

    async js() {}

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
        }`;
        
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
        
        const resp = await ( await fetch(this.params.baseUrl, options)).json();
        return resp.data.heatingSchedule
    }

    async getCurrentRoomInfo() {
        const query = `
        query CurrentRoomInfo {
            currentRoomInfo {
              name
              roomTemperature
              setpoint
              heatOutputPercentage
              allowHeating
            }
          }`;
    
        const options = {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
            })
        };
        
        const resp = await ( await fetch(this.params.baseUrl, options)).json();
        return resp.data.currentRoomInfo
    }
    
    async getRoomInfo(date) {
        const query = `
        query RoomInfo($date: String!, $resolution: Resolution) {
            roomInfo(date: $date, resolution: $resolution) {
              date
              rooms {
                name
                deviceAddress
                nodes {
                  timestamp
                  temperature
                  setpoint
                  heatOutputPercentage
                  allowHeating
                }
              }
            }
        }`;
    
        const options = {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    date,
                    resolution: 'TEN_MINUTES',
                }
            })
        };
        
        const resp = await ( await fetch(this.params.baseUrl, options)).json();
        return resp.data.roomInfo
    }

    async renderCharts() {
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const schedule = await this.getSchedule(dateStr);
        const prices = schedule.map((e) => ((e.total * 100).toFixed(1)));
        prices.push(prices[prices.length - 1]);

        const priceChartOptions = {
            stroke: {
                curve: 'stepline',
                width: 3,
            },
            chart: {
                width: '100%',
                height: 200,
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
                    formatter: (value) => (`${(value - 1) % 24}:00-${value % 24 }:00`),
                },
                y: {
                    formatter: (value) => (value + ' öre'),
                },
            }
        }
        const chart = new ApexCharts(document.querySelector('#priceChart'), priceChartOptions)
        chart.render()
        
        const currentRoomInfo = await this.getCurrentRoomInfo();
        const rooms = currentRoomInfo.map((e) => (e.name));
        const temperature = currentRoomInfo.map((e) => (e.roomTemperature));
        const setpoint = currentRoomInfo.map((e) => (e.setpoint));
        const heatOutputPercentage = currentRoomInfo.map((e) => (e.heatOutputPercentage));
        const maxValue = Math.max(...temperature, ...setpoint);
        const yAxisMaxValue = Math.max(Math.ceil(maxValue * 1.1), 25);
        const roomChartOptions = {
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
                position: 'bottom',
                offsetY: -20,
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
                    rotate: -20,
                },
            categories: rooms,
            },
            grid: {
                padding: {
                  left: 5,
                },
              },
            yaxis: [
                {
                    seriesName: 'Temperature',
                    minWidth: 0,
                    maxWidth: 25,
                    min: 0,
                    max: yAxisMaxValue,
                    labels: {
                        offsetX: -8,
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
                style: {
                    fontSize: '11px',
                    fontFamily: 'monospace'
                },
                y: [
                    {
                        formatter: function (val) {
                        return val + "&#176;C"
                        }
                    },
                    {
                        formatter: function (val) {
                            return val + "&#176;C"
                        }
                    },
                    {
                        formatter: function (val) {
                            return val + "%"
                        }
                    }
                ]
            }
            };
  
        const roomChart = new ApexCharts(document.querySelector("#roomChart"), roomChartOptions);
        roomChart.render()

        
        const roomInfo = await this.getRoomInfo(date.toISOString().split('T')[0]);

        const roomTempSeries = roomInfo.rooms.map(room => {
            const roomSeries = {
                name: room.name,
                data: room.nodes.map(node => node.temperature)
            }
            if (roomSeries.data.length < 144) {
                roomSeries.data = [...roomSeries.data, ...Array(144 - roomSeries.data.length).fill(0)]
            }
            return roomSeries;
        });

        const roomTempHistoryChartOptions = {
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            chart: {
                width: '100%',
                height: 200,
                toolbar: {
                    show: false,
                  },
                type: 'line',
            },
            series: roomTempSeries,
            legend: {
                position: 'bottom',
                labels: {
                    colors: '#d3d3d3',
                },
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 400,
            },
            xaxis: {
                type: 'numeric',
                tickAmount: 12,
                labels: {
                    style: {
                        colors: '#d3d3d3',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 400,
                    },
                    rotate: 0,
                    formatter: (value) => { 
                        return String(Math.floor((value + 1) / 6)).padStart(2, '0');
                    },
                },
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
            fill: {
                opacity: 1
            },
            tooltip: {
                style: {
                    fontSize: '11px',
                    fontFamily: 'monospace'
                },
                x: {
                    formatter: (value) => (`
                        ${String(Math.floor((value-1)/6)).padStart(2, '0') 
                        }:${
                        ((value-1)%6).toFixed(0) + '0'
                        }-${
                        String(Math.floor((value)/6)).padStart(2, '0') 
                        }:${
                        ((value)%6 ).toFixed(0) + '0'}`),
                },
                y: {
                    formatter: function (val) {
                    return val + "&#176;C"
                    }
                },
            }
        };
  
        const roomTempHistoryChart = new ApexCharts(document.querySelector("#roomTempHistoryChart"), roomTempHistoryChartOptions);
        roomTempHistoryChart.render()

        const heatOutputPercentageSeries = roomInfo.rooms.map(room => {
            const roomSeries = {
                name: room.name,
                data: room.nodes.map(node => node.heatOutputPercentage),
                type: 'line',
            }
            if (roomSeries.data.length < 144) {
                roomSeries.data = [...roomSeries.data, ...Array(144 - roomSeries.data.length).fill(0)]
            }
            return roomSeries;
        });
        const roomOutputHistoryChartOptions = {
            stroke: {
                curve: 'smooth',
                width: [...Array(roomInfo.rooms.length).fill(3), 0],
            },
            chart: {
                width: '100%',
                height: 200,
                toolbar: {
                    show: false,
                  },
                type: 'area',
            },
            dataLabels: {
                enabled: false
            },
            series: [
                ...heatOutputPercentageSeries,
                {
                    name: 'No heating',
                    data: roomInfo.rooms[0].nodes.map(node => node.allowHeating ? 0 : 105),
                    type: 'area',
                }
            ],
            fill: {
                colors: ["#FF0000"],
                type: [...Array(roomInfo.rooms.length).fill('solid'), 'gradient'] ,
                gradient: {
                    shade: 'dark',
                    type: "horizontal",
                    shadeIntensity: 0.5,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.6,
                    opacityTo: 0.6,
                },
            },
            legend: {
                markers: {
                    fillColors: [...Array(roomInfo.rooms.length).fill(undefined), '#701c24']
                },
                position: 'bottom',
                labels: {
                    colors: '#d3d3d3',
                },
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 400,
            },
            xaxis: {
                type: 'numeric',
                tickAmount: 12,
                labels: {
                    style: {
                        colors: '#d3d3d3',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 400,
                    },
                    rotate: 0,
                    formatter: (value) => { 
                        return String(Math.floor((value + 1) / 6)).padStart(2, '0');
                    },
                },
            },
            yaxis: {
                tickAmount: 5,
                min: 0,
                max: 100,
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
                style: {
                    fontSize: '11px',
                    fontFamily: 'monospace'
                },
                x: {
                    formatter: (value) => (`
                        ${String(Math.floor((value-1)/6)).padStart(2, '0') 
                        }:${
                        ((value-1)%6).toFixed(0) + '0'
                        }-${
                        String(Math.floor((value)/6)).padStart(2, '0') 
                        }:${
                        ((value)%6 ).toFixed(0) + '0'}`),
                },
                y: {
                    formatter: function (val) {
                    return val + "%"
                    }
                },
            }
        };
  
        const roomOutputHistoryChart = new ApexCharts(document.querySelector("#roomOutputHistoryChart"), roomOutputHistoryChartOptions);
        roomOutputHistoryChart.render()
    }

    async render() {
        this.container.innerHTML = await this.getHtml();
        this.renderCharts();
    }

    async getHtml() {
        return `
        <div id="priceChart" class="Chart" style="margin-bottom:-30px;">
        </div>
        </br>
        <div id="roomChart" class="Chart" style="margin-bottom:-30px;">
        </div>
        <div id="roomTempHistoryChart" class="Chart">
        </div>
        <div id="roomOutputHistoryChart" class="Chart">
        </div>
        `;
    }
}