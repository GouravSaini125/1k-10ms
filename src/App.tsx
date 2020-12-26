import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom'
import Hero from "./containers/Hero";
import {MeetProvider} from "./contexts/MeetContext";

function App() {
    return (
        <MeetProvider>
            <BrowserRouter>
                <Hero/>
            </BrowserRouter>
        </MeetProvider>
    );
}

export default App;
