export async function getTransformerLevel() {
    const query = `
    query TransformerLevel {
        transformerLevel
    }
    `;
    
    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query
        })
    };
    
    const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
    // const resp = await ( await fetch(`http://localhost:4000/api/graphql`, options)).json();
    return resp.data.transformerLevel;
}

export async function setTransformerLevel(level) {
    const query = `
        mutation Mutation($level: Int!) {
            setTransformerLevel(level: $level) 
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
                level,
            },
        })
    };

    const resp = await ( await fetch(`http://192.168.50.36:4000/api/graphql`, options)).json();
    // const resp = await ( await fetch(`http://localhost:4000/api/graphql`, options)).json();
    return resp.data.setTransformerLevel;
}
