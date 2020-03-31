import React, { useState, useEffect, useContext } from "react";
import "./App.sass";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Navigate from "./components/Navigate";
import { store } from "./store";
import Login from "./pages/Login";
import { getToken } from "./api/user";
import { message } from "antd";
import Waiting from "./pages/Waiting";

const App = () => {
    const { dispatch } = useContext(store);
    const [isLogged, setisLogged] = useState("waiting");

    useEffect(() => {
        (async () => {
            try {
                let res = await getToken();
                if (res.code === 200) {
                    console.log(res.data)
                    dispatch({
                        type: "SET_USER",
                        payload: res.data
                    });
                    setisLogged("yes");
                } else {
                    message.error(res.msg);
                    setisLogged("no");
                }
            } catch (err) {
                message.error(err);
            }
        })();
    }, [dispatch]);

    return (
        <div className="App">
            <Router>
                {(isLogged === "waiting" && <Waiting></Waiting>) ||
                    (isLogged === "yes" && (
                        <>
                            <Nav></Nav>
                            <Navigate></Navigate>
                        </>
                    )) ||
                    (isLogged === "no" && (
                        <Route>
                            <Login></Login>
                        </Route>
                    ))}
            </Router>
        </div>
    );
};

export default App;
