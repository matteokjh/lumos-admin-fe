import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
const Waiting = () => {
    return (
        <div
            className="Waiting"
            style={{
                display: "flex",
                position: "fixed",
                top: 0,
                left: 0,
                alignItems: "center",
                justifyContent: "center",
                width: "100vw",
                height: "100vh"
            }}
        >
            <LoadingOutlined
                style={{
                    fontSize: 40,
                    color: "#ddd"
                }}
            />
        </div>
    );
};

export default Waiting;
