import Dashboard from "./views/Dashboard.js";
import Schedule from "./views/Schedule.js";
import Settings from "./views/Settings.js";

// state
let menuOpen = false;
//

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const routes = [
    { path: "/", view: new Dashboard() },
    { path: "/schedule", view: new Schedule() },
    { path: "/settings", view: new Settings() }
];

const router = async () => {
    console.log(location.pathname);
    let page = routes.find(e => e.path === location.pathname);
    
    if (!page) {
        page = routes[0];
    }

    if (page.path === '/') {
        document.getElementById('dashboard-menu-item').classList.add('selected')
        document.getElementById('schedule-menu-item').classList.remove('selected')
        document.getElementById('settings-menu-item').classList.remove('selected')
    } else if (page.path === '/schedule') {
        document.getElementById('dashboard-menu-item').classList.remove('selected')
        document.getElementById('schedule-menu-item').classList.add('selected')
        document.getElementById('settings-menu-item').classList.remove('selected')
    } else if (page.path === '/settings') {
        document.getElementById('dashboard-menu-item').classList.remove('selected')
        document.getElementById('schedule-menu-item').classList.remove('selected')
        document.getElementById('settings-menu-item').classList.add('selected')
    }

    page.view.render();
};

window.addEventListener("popstate", router);

const handleClickMenu = () => {
    menuOpen = !menuOpen;
    handleMenu();
}
const closeMenu = () => {
    menuOpen = false;
    handleMenu();
}
const handleMenu = () => {
    document.getElementById('menu-button-open').style.display = menuOpen ? 'none' : 'block';
    document.getElementById('menu-button-close').style.display = menuOpen ? 'block' : 'none';
    if (menuOpen) {
        document.getElementById('menu-container').classList.add('menu-open');
    } else {
        document.getElementById('menu-container').classList.remove('menu-open');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app");
    routes.forEach(e => {
        e.view.setContainer(app);
    })
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            closeMenu();
            e.preventDefault();
            navigateTo(e.target.href);
        } else if (e.target.matches('.menu-icon')) {
            handleClickMenu();
        } else if (document.getElementById('app').contains(e.target)) {
            closeMenu();
        }
    });

    router();
});
