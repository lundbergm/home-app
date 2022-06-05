import { useState } from 'react';
import { Interval, useSchemaQuery } from '../../generated/graphql';
import Overview from './Overview';

enum Tab {
    Today,
    Tomorrow,
}

const OverviewContainer = () => {
    return (
        <div className="">
            <Overview />
        </div>
    );
};

export default OverviewContainer;
