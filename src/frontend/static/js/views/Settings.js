import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
        this.js();
        this.value = 74;
    }

    async js() {
        document.body.addEventListener("click", e => {
            console.log(e);
            if (e.target.matches('#minus-button')) {
                handleClick(-1)
            } else if (e.target.matches('#plus-button')) {
                handleClick(1)
            }
        });

        const handleClick = (value) => {

            const elem = document.getElementById('value');
            elem.innerHTML = parseInt(elem.innerHTML) + value;
            
            
            // this.render()
        }
    }

    async getHtml() {
        return `
        <div>
            <button id="minus-button" >-</button>
            <span id="value" >${this.value}</span>
            <button id="plus-button" >+</button>
        </div>
        `;
    }
}