export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    setContainer(container) {
        this.container = container;
    }

    async getHtml() {
        return "";
    }

    async render() {
        this.container.innerHTML = await this.getHtml();
    }
}