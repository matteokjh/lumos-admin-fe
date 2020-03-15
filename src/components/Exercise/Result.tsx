import React, { useContext } from "react";
import { store } from "@/store";
import "@/styles/Result.sass"

const Result = () => {
    const { exerciseInfo } = useContext(store).state;

    return (
        <div className="Result">
            <div className="res_title">
                <h1>
                    {exerciseInfo.id}. {exerciseInfo.title}
                </h1>
            </div>
            <div className="res_main">
                
            </div>
        </div>
    );
};

export default Result;
