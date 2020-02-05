import React from 'react'
import { Form, Input, InputNumber, Button, Radio } from 'antd'
import '../styles/ExerciseForm.sass'
import { COLOR } from '../utils/global_config'

const ExerciseForm = (props: any) => {
    const { getFieldDecorator } = props.form

    // methods
    const save = () => {

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
                <Form.Item className='btn-group'>
                    <Button type='primary'>保存</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Form.create({
    name: 'ExerciseForm'
})(ExerciseForm)