import { getTransformerLevel, setTransformerLevel } from "../api.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
        this.js();
        this.value = 0;
    }

    async js() {
        this.value = await getTransformerLevel();
        this.render()

        document.body.addEventListener("click", e => {
            if (e.target.matches('#minus-button')) {
                handleClick(-1)
            } else if (e.target.matches('#plus-button')) {
                handleClick(1)
            }
        });

        const handleClick = async (value) => {
            const requestValue = this.value + value;

            this.value = await setTransformerLevel(requestValue)
            console.log(this.value);
            this.render()
        }   
    }

    async getHtml() {
        return `
        <div class="transformer-container">
            <button id="minus-button" class="transformer-button" >-</button>
            <span class="transformer-value" id="value" >${this.value}%</span>
            <button id="plus-button" class="transformer-button" >+</button>
        </div>
        `;
    }
}
