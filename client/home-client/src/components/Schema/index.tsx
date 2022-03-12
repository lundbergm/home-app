import * as React from 'react';
import { Interval, useSchemaQuery } from '../../generated/graphql';
import Schema from './Schema';

const SchemaContainer = () => {
    const {
        data: today,
        error: todayError,
        loading: todayLoading,
    } = useSchemaQuery({
        variables: { interval: Interval.Today },
    });
    const {
        data: tomorrow,
        error: tomorrowError,
        loading: tomorrowLoading,
    } = useSchemaQuery({
        variables: { interval: Interval.Tomorrow },
    });

    if (todayLoading || tomorrowLoading) {
        return <div>Loading...</div>;
    }

    if (todayError || !today || tomorrowError || !tomorrow) {
        return <div>ERROR</div>;
    }
    console.log(tomorrow);
    return (
        <>
            <Schema data={today} isToday={true} />
            <Schema data={tomorrow} isToday={false} />
        </>
    );
};

export default SchemaContainer;
