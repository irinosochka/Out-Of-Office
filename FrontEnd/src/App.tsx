import React from 'react';
import './App.css';

import MainPage from "./pages/MainPage";
import {RoleProvider} from "./context/RoleContext";

function App() {

    return (
        <RoleProvider>
            <MainPage />
        </RoleProvider>
    );
}

export default App;
