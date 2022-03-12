import React from 'react';
import house from './house.svg';
import './App.css';
import SchemaContainer from './components/Schema';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    <code>Home</code>
                </p>
            </header>
            <SchemaContainer />
        </div>
    );
}

export default App;
