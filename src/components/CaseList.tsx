import React from "react";


const CaseList = (props: any) => {
    console.log(props);

    return <div className="CaseList" ref={props.innerRef}></div>;
};

export default CaseList;
