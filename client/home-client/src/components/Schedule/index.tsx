import { useState } from 'react';
import { Interval, useSchemaQuery } from '../../generated/graphql';
import Schema from './Schedule';

enum Tab {
    Today,
    Tomorrow,
}

const ScheduleContainer = () => {
    const [activeTab, setActiveTab] = useState(Tab.Today);
    const { data: today, error: todayError, loading: todayLoading } = useSchemaQuery({
        variables: { interval: Interval.Today },
    });
    const { data: tomorrow, error: tomorrowError, loading: tomorrowLoading } = useSchemaQuery({
        variables: { interval: Interval.Tomorrow },
    });

    if (todayLoading || tomorrowLoading) {
        return <div>Loading...</div>;
    }

    if (todayError || !today || tomorrowError || !tomorrow) {
        return <div>ERROR</div>;
    }
    //  Functions to handle Tab Switching
    const handleClickToday = () => {
        // update the state to tab1
        setActiveTab(Tab.Today);
    };
    const handleClickTomorrow = () => {
        // update the state to tab2
        setActiveTab(Tab.Tomorrow);
    };
    return (
        <div className="Tabs">
            <ul className="nav">
                <li className={activeTab === Tab.Today ? 'active' : ''} onClick={handleClickToday}>
                    Today
                </li>
                <li className={activeTab === Tab.Tomorrow ? 'active' : ''} onClick={handleClickTomorrow}>
                    Tomorrow
                </li>
            </ul>

            <div className="outlet">
                {activeTab === Tab.Today ? (
                    <Schema data={today} isToday={true} />
                ) : (
                    <Schema data={tomorrow} isToday={false} />
                )}
            </div>
        </div>
    );
};

export default ScheduleContainer;
