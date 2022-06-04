import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Viewing Post");
    }

    async test() {
        document.body.addEventListener("click", e => {
            console.log('SETUP');
            if (e.target.matches("[data-link]")) {
                handleClickMenu();
                e.preventDefault();
                navigateTo(e.target.href);
            } else if (e.target.matches('.menu-icon')) {
                handleClickMenu();
            }
        });
    }

    async getHtml() {
        return `
            <h1>Post</h1>
            <p>You are viewing post #${this.postId}.</p>
        `;
    }
}
