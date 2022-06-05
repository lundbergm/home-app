import React from 'react';
import { SchemaQuery } from '../../generated/graphql';
import './styles.css';

interface Props {}

const className = 'Overview';

function Card({ title, color }: { title: string; color: string }): JSX.Element {
    const className = 'Card';
    return (
        <div style={{ backgroundColor: color }} className={className}>
            <div>{title}</div>
            <div className={`${className}-data`}></div>
        </div>
    );
}

const Overview: React.FC<Props> = ({}) => {
    return (
        <div className={className}>
            <h3>Overview</h3>
            <div className={`${className}-card-container`}>
                <Card title="Elpris" color="#275127" />
                <Card title="Snittpris" color="#6F3747" />
            </div>
        </div>
    );
};

export default Overview;
