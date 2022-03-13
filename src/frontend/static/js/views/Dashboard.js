import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
        this.js();
    }

    async js() {

    }
    async getSchedule(interval) {
        const query = `
        query Schema($interval: Interval!) {
            heatingSchedule(interval: $interval) {
                startsAt
                level
                heatingCartridge
                energy
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
            interval: interval.toUpperCase(),
        }
        })
    };
    
    const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
    return resp.data.heatingSchedule
    }

    async renderCharts() {
        const schedule = await this.getSchedule('today');
        const prices = schedule.map((e) => ((e.energy * 100).toFixed(1)));
        var lineOptions = {
            stroke: {
                curve: 'smooth',
            },
            chart: {
                width: '100%',
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
    }

    async render() {
        this.container.innerHTML = await this.getHtml();
        this.renderCharts();
    }

    async getHtml() {
        return `
        <div id="chart" class="Chart">
        </div>
        `;
    }
}