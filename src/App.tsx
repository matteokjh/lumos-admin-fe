import React, { useState } from "react";
import "./App.sass";
import { BrowserRouter as Router } from "react-router-dom";
import Nav from "./components/Nav";
import Navigate from "./components/Navigate";

const App = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="App">
            <Router>
                <Nav collapsed={collapsed} setCollapsed={setCollapsed}></Nav>
                <Navigate collapsed={collapsed}></Navigate>
            </Router>
        </div>
    );
};

export default App;
