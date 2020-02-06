import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Radio, message } from 'antd'
import '../styles/ExerciseForm.sass'
import { COLOR } from '../utils/global_config'
import { ExeBaseInfo, opType } from '../types/exercise'
import { saveExercise } from '../api/exercise'
import { useLocation } from 'react-router-dom'



const ExerciseForm = (props: any) => {
    const { getFieldDecorator } = props.form
    const location = useLocation()
    const [type, setType] = useState('' as opType)

    useEffect(() => {
        if(location.pathname.indexOf('new') >= 0) {
            setType('new') // 新建题目，id可变
        } else {
            setType('detail') // 修改题目，id不可变
        }
    }, [location.pathname])

    // methods
    const save = () => {
        props.form.validateFields(async (err: Error, values: ExeBaseInfo) => {
            if(!err) {
                try {
                    let res = await saveExercise({
                        data: values,
                        type: type
                    })
                    console.log(res)
                    if(res.code === 200) {
                        message.success(res.msg)
                    } else {
                        message.error(res.msg)
                    }
                } catch(err) {
                    message.error(err)
                }
            }
        })
    }
    return (
        <div className="ExerciseForm">
            <Form onSubmit={save} className="exercise-form">
                <Form.Item label='编号'>
                {getFieldDecorator('id', {
                    rules: [{ required: true, message: '请输入数字编号', type: 'number' }],
                })(
                    <InputNumber
                        placeholder="编号"
                        min={0}
                        max={99999999}
                    />,
                )}
                </Form.Item>
                <Form.Item label='标题'>
                {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入标题' }],
                })(
                    <Input
                        placeholder="标题"
                        allowClear
                        autoComplete='off'
                    />,
                )}
                </Form.Item>
                <Form.Item label='难度'>
                {getFieldDecorator('mode', {
                    initialValue: ''
                })(
                    <Radio.Group>
                        <Radio value='Easy'><span style={{
                            color: COLOR.EASY_MODE
                        }}>简单</span></Radio>
                        <Radio value='Medium'><span style={{
                            color: COLOR.MEDIUM_MODE
                        }}>中等</span></Radio>
                        <Radio value='Hard'><span style={{
                            color: COLOR.HARD_MODE
                        }}>困难</span></Radio>
                        <Radio value=''>未知</Radio>
                    </Radio.Group>
                )}
                </Form.Item>
                <Form.Item label='贡献者'>
                {getFieldDecorator('contributor')(
                    <Input
                        allowClear
                        autoComplete='off'
                    />,
                )}
                </Form.Item>
                <Form.Item className='btn-group'>
                    <Button onClick={save} type='primary'>新建题目</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Form.create({
    name: 'ExerciseForm'
})(ExerciseForm)