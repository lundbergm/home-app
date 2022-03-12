import * as React from 'react';
import { PriceLevel, SchemaQuery } from '../../generated/graphql';
import './styles.css';

interface Props {
    data: SchemaQuery;
    isToday: boolean;
}

const className = 'Schema';

const Schema: React.FC<Props> = ({ data, isToday }) => {
    const title = isToday ? 'Today' : 'Tomorrow';
    return (
        <div className={className}>
            <h3>{title}</h3>
            <div className={`${className}__list`}>
                {!!data.heatingSchedule &&
                    data.heatingSchedule.map((timeSlot, i) => {
                        const now = new Date();
                        const startsAt = new Date(timeSlot.startsAt);
                        const endsAt = new Date(timeSlot.startsAt);
                        endsAt.setHours(endsAt.getHours() + 1);
                        const isNow = isToday && now >= startsAt && now < endsAt;
                        console.log(isNow);
                        let color;
                        switch (timeSlot.level) {
                            case PriceLevel.VeryCheap: {
                                color = '🟢';
                                break;
                            }
                            case PriceLevel.Cheap: {
                                color = '🔵';
                                break;
                            }
                            case PriceLevel.Normal: {
                                color = '⚪️';
                                break;
                            }
                            case PriceLevel.Expensive: {
                                color = '🟡';
                                break;
                            }
                            case PriceLevel.VeryExpensive: {
                                color = '🔴';
                                break;
                            }

                            default:
                                break;
                        }
                        return (
                            <li key={i} className={`${className}__item${isNow ? '_now' : ''}`}>
                                {color}
                                {'   '}
                                {timeSlot.heatingCartridge ? '✅' : '❌'}
                                {'  '}
                                {startsAt.toLocaleTimeString().substring(0, 5)}-
                                {endsAt.toLocaleTimeString().substring(0, 5)}: {(timeSlot.energy * 100).toFixed(1)}
                            </li>
                        );
                    })}
            </div>
        </div>
    );
};

export default Schema;
