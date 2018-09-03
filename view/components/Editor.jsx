import React, { Component } from 'react';
import { Button, Icon, Modal, Upload, Input } from 'antd';
import { uploadImage } from '../api';

const { TextArea } = Input;
class Editor extends Component {
    state = {
        value: '',
        visible: false
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    handleUpload = async (e) => {
        const body = new FormData();
        body.append('image', e.file);
        const res = await uploadImage(body);
        if (res.ok) {
            const json = await res.json();
            if (json.err === 0) {
                const value = this.state.value + `![${e.file.name}](${json.data})`;
                this.setState({
                    visible: false,
                    value: value
                });
            }
        }
    }
    getValue = () => this.state.value;
    setValue = (value) => this.setState({
        value: value
    });
    handleChange = (e) => {
        this.setState({
            value: e.target.value
        });
    }
    handleKeyDown = (e) => {
        if (e.keyCode === 9) {
            e.preventDefault();
            const value = e.target.value + '\t';
            this.setState({
                value: value
            });
        }
    }
    render() {
        return (
            <div id={this.props.id} style={{ lineHeight: 'normal' }}>
                <ul className="menu menu-horizon editor-tool">
                    <li className="menu-item">
                        <a onClick={this.showModal}>
                            <Icon type="picture" />
                        </a>
                    </li>
                </ul>
                <TextArea onKeyDown={this.handleKeyDown} className="editor" value={this.state.value} onChange={this.handleChange} rows="15"></TextArea>
                <Modal
                    title="图片上传"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    bodyStyle={{ textAlign: 'center' }}
                >
                    <Upload
                        accept="image/*"
                        customRequest={this.handleUpload}
                        showUploadList={false}
                    >
                        <Button>
                            <Icon type="upload" />上传图片
						</Button>
                    </Upload>
                </Modal>
            </div>
        );
    }
};
export default Editor;