import React from 'react'
import { Button, Icon } from 'antd'
import { useHistory } from 'react-router-dom'
import MarkdownEditor from '../components/MarkdownEditor'

// 单个题目组件，适用 新增题目、题目详情（含编辑）
const SingleExercise = () => {
    const history = useHistory()

    // methods
    const back = () => {
        history.goBack()
    }

    return (
        <div className="SingleExercise">
            {/* 按钮组 */}
            <div className="toolbar">
                <Button onClick={back}>
                    <Icon type="arrow-left" />
                    <span>返回</span>
                </Button>
            </div>
            {/* 主体 */}
            <div className="main">
                <MarkdownEditor></MarkdownEditor>
            </div>
        </div>
    )
}

export default SingleExercise