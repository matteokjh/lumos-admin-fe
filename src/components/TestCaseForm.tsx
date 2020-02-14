import React, { useContext, useState } from "react";
import { store } from "../store";
import { Button, message } from "antd";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import AddTestCaseModal from "./modals/AddTestCaseModal";
import { testCaseType } from "../types/exercise";
import CaseItem from "./CaseItem";

import "../styles/TestCaseForm.sass";
import { saveExercise } from "../api/exercise";

const TestCaseForm = () => {
    const { state, dispatch } = useContext(store);
    const { exerciseInfo } = state;
    const [showModal, setShowModal] = useState(false);

    // modal 取消
    const handleCancel = () => {
        setShowModal(false);
    };
    // 新增用例
    const addTestCase = async (obj: testCaseType) => {
        let arr = exerciseInfo.testCase;
        if (!Array.isArray(arr)) {
            arr = [];
        }
        try {
            let res = await saveExercise({
                data: {
                    ...exerciseInfo,
                    testCase: arr.concat({
                        input: obj.input,
                        output: obj.output,
                        show: false,
                        text: obj.text || ""
                    })
                },
                type: "detail"
            });
            if (res.code === 200) {
                message.success(res.msg);
                dispatch({
                    type: "SET_EXERCISE",
                    payload: res.data
                });
            }
        } catch (err) {
            message.error(err);
        }
        setShowModal(false);
    };
    // 拖拽
    const handleDragEnd = (res: DropResult) => {
        console.log("end", res);
        let from = res.source;
        let to = res.destination;
        let fromIdx = from.index;
        if (!to) return;
        let toIdx = to.index;
        // 如果是左边移动到了右边的最下面
        if (to.droppableId === "column_2" && toIdx % 2 === 0) {
            toIdx++;
        }
        // 如果是右边移动到了左边的最下面
        if (to.droppableId === "column_1" && toIdx % 2 === 1) {
            toIdx++;
        }
        console.log(fromIdx, toIdx);
    };

    return (
        <div className="TestCaseForm">
            <div className="btn">
                <Button type="primary" onClick={() => setShowModal(true)}>
                    添加用例
                </Button>
            </div>
            <div className="dndContainer">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={"column_1"}>
                        {provided => (
                            <div
                                className="column"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {exerciseInfo.testCase.map(
                                    (e, idx) =>
                                        idx % 2 === 0 && (
                                            <CaseItem
                                                index={idx}
                                                key={`column_1_${idx}`}
                                                caseInfo={e}
                                            ></CaseItem>
                                        )
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId={"column_2"}>
                        {provided => (
                            <div
                                className="column"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {exerciseInfo.testCase.map(
                                    (e, idx) =>
                                        idx % 2 === 1 && (
                                            <CaseItem
                                                index={idx}
                                                key={`column_2_${idx}`}
                                                caseInfo={e}
                                            ></CaseItem>
                                        )
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* 添加测试用例的 modal */}
            <AddTestCaseModal
                visible={showModal}
                onOk={addTestCase}
                onCancel={handleCancel}
            ></AddTestCaseModal>
        </div>
    );
};

export default TestCaseForm;
