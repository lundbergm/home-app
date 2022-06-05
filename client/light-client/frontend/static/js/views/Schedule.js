import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Schedule");
    }

    async getHtml() {
        return `
        <div class="Tabs">
            <ul class="nav">
                <li id="today-tab" class="active">Today</li>
                <li id="tomorrow-tab" class="">Tomorrow</li>
            </ul>
        </div>
        `;
    }
}