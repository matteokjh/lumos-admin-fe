import React, { useEffect } from 'react'
import { Button, Icon } from 'antd'
import '../styles/ExerciseList.sass'
import { useHistory } from 'react-router-dom'


const ExerciseList = () => {
    const history = useHistory()

    // methods
    const refresh = () => {

    }

    useEffect(() => {

    }, [])

    return (
        <div className="ExerciseList">
            {/* 按钮组 */}
            <div className="toolbar">
                <Button onClick={refresh}>刷新</Button>
                <Button type="primary" onClick={() => history.push('/exerciseList/new')}>
                    <Icon type="plus" />
                    <span>新增题目</span>
                </Button>
            </div>
            <div className="main">
                this is ExerciseList
            </div>
        </div>
    )
}

export default ExerciseList