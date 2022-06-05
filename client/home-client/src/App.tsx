import { useState } from 'react';
import './App.css';
import ScheduleContainer from './components/Schedule';
import menuIcon from './menu.svg';
import closeIcon from './close.svg';
import Overview from './components/Overview/Overview';

enum Page {
    Home,
    Schedule,
    Edit,
}

interface MenuItem {
    page: Page;
    title: string;
}

const className = 'App';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [page, setPage] = useState(Page.Home);

    const handleClickMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickMenuItem = (selected: Page) => {
        setPage(selected);
        setMenuOpen(false);
    };

    const menuItems: MenuItem[] = [
        { page: Page.Home, title: 'Home' },
        { page: Page.Schedule, title: 'Schudule' },
        { page: Page.Edit, title: 'Edit' },
    ];

    let renderPage;
    switch (page) {
        case Page.Home: {
            renderPage = <Overview />;
            break;
        }
        case Page.Schedule: {
            renderPage = <ScheduleContainer />;
            break;
        }
        case Page.Edit: {
            renderPage = <div></div>;
            break;
        }
    }

    return (
        <div className={className}>
            <header className={`${className}-header`}>
                <img className="menu-icon" src={menuOpen ? closeIcon : menuIcon} onClick={handleClickMenu} />
                <p className={`${className}-header-title`}>
                    <code>Home</code>
                </p>
            </header>
            <div className={`menu-container ${menuOpen ? 'menu-open' : ''}`}>
                <div className="menu-header-cover"></div>
                <ul>
                    {menuItems.map((item) => {
                        return (
                            <li
                                onClick={() => handleClickMenuItem(item.page)}
                                className={`menu-item ${page === item.page ? 'selected' : ''}`}
                            >
                                <span>{item.title}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={`${className}-content`}>{renderPage}</div>
        </div>
    );
}

export default App;
