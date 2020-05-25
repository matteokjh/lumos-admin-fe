import React, { useState, useEffect } from "react";
import { message } from "antd";
import { getUserStatistics } from '@/api/statistics'
import "./chart.sass";

const Chart4 = (props: any) => {
    const { refProps } = props;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getUserStatistics()
                console.log(res)
                if(res?.code === 200) {
                    console.log(res.data)
                } else {
                    message.error(res?.msg)
                }
            } catch (err) {
                message.error(err);
            }
        })();
    }, []);

    return (
        <div className="chart4 chart">
            <h2>用户统计</h2>
        </div>
    );
};

export default Chart4;
