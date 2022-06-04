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

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/schedule", view: Schedule },
        { path: "/settings", view: Settings }
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    
    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    console.log(match.route.path);
    document.getElementById('dashboard-menu-item').classList. = menuOpen ? 'none' : 'block';


    const view = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

const handleClickMenu = () => {
    menuOpen = !menuOpen;
    document.getElementById('menu-button-open').style.display = menuOpen ? 'none' : 'block';
    document.getElementById('menu-button-close').style.display = menuOpen ? 'block' : 'none';
    if (menuOpen) {
        document.getElementById('menu-container').classList.add('menu-open');
    } else {
        document.getElementById('menu-container').classList.remove('menu-open');
    }
}

function testfn() {
    console.log('Test fn called!');
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            handleClickMenu();
            e.preventDefault();
            navigateTo(e.target.href);
        } else if (e.target.matches('.menu-icon')) {
            handleClickMenu();
        }
    });

    router();
});
