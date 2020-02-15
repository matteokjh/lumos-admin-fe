import React, { useContext, useState, useEffect } from "react";
import { store } from "../store";
import { Button, message, Spin } from "antd";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import AddTestCaseModal from "./modals/AddTestCaseModal";
import { testCaseType } from "../types/exercise";
import CaseItem from "./CaseItem";

import "../styles/TestCaseForm.sass";
import { saveExercise } from "../api/exercise";

type modeType = "new" | "edit";

const TestCaseForm = () => {
    const { state, dispatch } = useContext(store);
    const { exerciseInfo } = state;
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("new" as modeType);
    const [activeItem, setActiveItem] = useState({} as testCaseType);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [testCaseList, setTestCaseList] = useState([] as testCaseType[]);
    const [loading, setloading] = useState(false);

    // modal 取消
    const handleCancel = () => {
        setShowModal(false);
    };
    // 新增/编辑用例
    const addTestCase = async (param: {
        obj: testCaseType;
        type: modeType;
        index: number;
    }) => {
        const { obj, type, index } = param;
        let arr = [...testCaseList];
        if (!Array.isArray(arr)) {
            arr = [];
        }
        if (type === "edit") {
            arr[index] = obj;
        } else {
            arr = arr.concat({
                input: obj.input,
                output: obj.output,
                show: false,
                text: obj.text || ""
            });
        }
        try {
            let res = await saveExercise({
                data: {
                    ...exerciseInfo,
                    testCase: arr
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
    const handleDragEnd = async (res: DropResult) => {
        let from = res.source;
        let to = res.destination;
        if (!to) return;
        if (from.droppableId === to.droppableId && from.index === to.index)
            return;
        setloading(true);
        let arr = [...testCaseList];
        let obj = arr[from.index];
        arr.splice(from.index, 1);
        arr.splice(to.index, 0, obj);
        setTestCaseList(arr);
        try {
            let res = await saveExercise({
                type: "detail",
                data: {
                    ...exerciseInfo,
                    testCase: arr
                }
            });
            if (res.code === 200) {
                message.success(res.msg);
                dispatch({
                    type: "SET_EXERCISE",
                    payload: res.data
                });
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
        setloading(false);
    };
    // 控制显示/隐藏
    const changeShow = async (idx: number, e: any) => {
        setloading(true);
        let arr = [...testCaseList];
        arr[idx].show = e.target.value;
        try {
            let res = await saveExercise({
                type: "detail",
                data: {
                    ...exerciseInfo,
                    testCase: arr
                }
            });
            if (res.code === 200) {
                message.success(res.msg);
                dispatch({
                    type: "SET_EXERCISE",
                    payload: res.data
                });
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
        setloading(false);
    };
    // 编辑
    const editItem = (idx: number) => {
        setMode("edit");
        setShowModal(true);
        setActiveItem(testCaseList[idx]);
        setActiveIdx(idx);
    };
    // 删除
    const deleteItem = async (idx: number) => {
        let arr = testCaseList.slice(0,idx).concat(testCaseList.slice(idx+1))
        try {
            let res = await saveExercise({
                type: "detail",
                data: {
                    ...exerciseInfo,
                    testCase: arr
                }
            });
            if (res.code === 200) {
                message.success(res.msg);
                dispatch({
                    type: "SET_EXERCISE",
                    payload: res.data
                });
            } else {
                message.error(res.msg);
            }
        } catch (err) {
            message.error(err);
        }
    };

    useEffect(() => {
        setTestCaseList(exerciseInfo.testCase);
    }, [exerciseInfo]);

    return (
        <Spin spinning={loading}>
            <div className="TestCaseForm">
                <div className="btn">
                    <h1>{exerciseInfo.id} - {exerciseInfo.title}</h1>
                    <Button
                        type="primary"
                        onClick={() => {
                            setMode("new");
                            setActiveIdx(-1)
                            setActiveItem({} as testCaseType)
                            setShowModal(true);
                        }}
                    >
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
                                    {testCaseList.map((e, idx) => (
                                        <CaseItem
                                            index={idx}
                                            key={`column_1_${idx}`}
                                            caseInfo={e}
                                            changeShow={changeShow}
                                            editItem={editItem}
                                            deleteItem={deleteItem}
                                        ></CaseItem>
                                    ))}
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
                    mode={mode}
                    activeItem={activeItem}
                    activeIdx={activeIdx}
                ></AddTestCaseModal>
            </div>
        </Spin>
    );
};

export default TestCaseForm;
