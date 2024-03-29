import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Schedule");
        this.js();
        this.tab = 'today';
    }

    async js() {
        document.body.addEventListener("click", e => {
            if (e.target.matches('#today-tab')) {
                handleClickTab('today')
            } else if (e.target.matches('#tomorrow-tab')) {
                handleClickTab('tomorrow')
            }
        });

        const handleClickTab = (tab) => {
            if (this.tab === tab) return;
            this.tab = tab;
            if (tab === 'today') {
                document.getElementById('today-tab').classList.add('active');
                document.getElementById('tomorrow-tab').classList.remove('active');
            } else {
                document.getElementById('today-tab').classList.remove('active');
                document.getElementById('tomorrow-tab').classList.add('active');
            }
            this.render()
        }
    }

    async getData() {   
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
        const date = new Date();
        if (this.tab === 'tomorrow') {
            date.setDate(date.getDate() + 1);
        }
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const options = {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: query,
            variables: {
                date: dateStr
            }
          })
        };
      
        const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
        return resp.data.heatingSchedule
      }

      async getHtml() {
            const getColor = (level) => {
            switch (level) {
                case "VERY_CHEAP": {
                    return '🟢';
                }
                case "CHEAP": {
                    return '🔵';
                }
                case "NORMAL": {
                    return '⚪️';
                }
                case "EXPENSIVE": {
                    return '🟡';
                }
                case "VERY_EXPENSIVE": {
                    return '🔴';
                }
            }
        }
        const schedule = await this.getData();
        const isToday = true;
        return `
        <div class="Tabs">
            <ul class="nav">
                <li id="today-tab" class="${this.tab === 'today' ? 'active' : ''}">Today</li>
                <li id="tomorrow-tab" class="${this.tab === 'tomorrow' ? 'active' : ''}">Tomorrow</li>
            </ul>
        
            <div class="Schedule">
            ${!isToday && data.heatingSchedule.length === 0 ? '<span>Waiting for spot prices...</span>' : ''}
            <div class="Schedule__list">
                ${schedule.map((timeSlot) => {
                    const now = new Date();
                    const startsAt = new Date(timeSlot.startTime);
                    const endsAt = new Date(timeSlot.endTime);
                    const isNow = isToday && now >= startsAt && now < endsAt;
                    return `
                    <li class="Schedule__item${isNow ? '_now' : ''}">
                        ${getColor(timeSlot.level)}
                        ${timeSlot.heatingCartridge ? '✅' : '❌'}
                        ${startsAt.toLocaleTimeString().substring(0, 5)} - ${endsAt.toLocaleTimeString().substring(0, 5)}  ${(timeSlot.total * 100).toFixed(1)}
                    </li>`
                 }).join('')}
                </div>
            </div>
        </div>
        `;
    }
}
