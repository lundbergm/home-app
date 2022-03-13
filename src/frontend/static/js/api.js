export function getSchedule(interval) {
    const query = `
        query Schema($interval: Interval!) {
            heatingSchedule(interval: $interval) {
                startsAt
                level
                heatingCartridge
                energy
            }
        }
    `;
    
    const options = {
        method: "post",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        query: query,
        variables: {
            interval: interval.toUpperCase(),
        }
        })
    };
    
    const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
    return resp.data.heatingSchedule
}