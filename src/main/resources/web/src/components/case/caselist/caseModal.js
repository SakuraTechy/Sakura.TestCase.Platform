/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import {
  Upload,
  Form,
  message,
  Modal,
  Input,
  Icon,
  Row,
  Col,
  TreeSelect,
} from 'antd';
const { Dragger } = Upload;
import './index.scss';
const initData = `{"root":{"data":{"id":"bv8nxhi3c800","created":1562059643204,"text":"中心主题"},"children":[]},"template":"default","theme":"fresh-blue","version":"1.4.43","base":0}`;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
import request from '@/utils/axios';
import getQueryString from '@/utils/getCookies';
const getCookies = getQueryString.getCookie;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
/* global moment, cardStatusList, priorityList, staffNameCN, staffNamePY */
class CaseModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    productId: PropTypes.any,
    requirementId: PropTypes.any,
    product: PropTypes.object,
    requirement: PropTypes.array,
    data: PropTypes.object,
    options: PropTypes.object,
    form: PropTypes.object,
    onUpdate: PropTypes.func,
    onClose: PropTypes.func,
  };
  constructor(props) {
    super(props);
    let { product, requirement, options, data, title } = this.props;
    this.state = {
      title: '',
      show: this.props.show,
      iterationList: [], // 需求列表
      nameFilter: '', // 场景名称筛选最终选择
      xmindFile: null, // 保存上传的file文件，单文件
      productId: this.props.productId,
      requirementId: this.props.requirementId,
      operate: title,
      data: data,
      product: product,
      requirement: requirement,
      options: options,
      value: [],
      cardTree: [],
      bizIds: [],
    };
  }
  componentDidMount() {
    this.getCardTree();
    if (this.props.data && this.props.data.id) {
      this.getDetailById();
    }
    this.props.data &&
      this.props.data.requirementId &&
      this.getRequirementsById(this.props.data.requirementId);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
    if (!nextProps.show) {
      this.props.form.resetFields();
    }
    if (nextProps.show && nextProps.show !== this.state.show) {
      let { options, product, requirement } = nextProps;

      this.setState({
        data: nextProps.data,
        requirementId: requirement ? requirement.id : null,
        product: product,
        requirement: requirement,
        options: options,
      });
    }
  }
  getCardTree = () => {
    request(`${this.props.doneApiPrefix}/dir/cardTree`, {
      method: 'GET',
      params: {
        productLineId: this.props.productId,
        channel: 1,
      },
    }).then(res => {
      this.setState({ cardTree: res.data ? res.data.children : [] });
    });
  };
  getDetailById = () => {
    request(`${this.props.doneApiPrefix}/case/detail`, {
      method: 'GET',
      params: { caseId: this.props.data.id },
    }).then(res => {
      const bizIds = res.data.biz.map(item => {
        return item.bizId;
      });
      this.setState({ bizIds });
    });
  };
  getRequirementsById = requirementIds => {
    // request(`${this.props.oeApiPrefix}/business-lines/requirements`, {
    //   method: 'GET',
    //   params: { requirementIds: requirementIds },
    // }).then(res => {
    //   this.setState({ requirementArr: res });
    // });
  };
  handleOk = () => {
    const { operate } = this.state;
    if (operate != 'edit') {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.saveEditerData(values);
        }
      });
    } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.renameOk(values);
        }
      });
    }
  };
  // 确认新建
  saveEditerData(values) {
    let requirementId = values.jiar + ' ' + values.requirementId;
    let params = {
      productLineId: Number(this.props.productId),
      creator: getCookies('username'),
      caseType: 0,
      caseContent: initData,
      title: values.case,
      channel: 1,
      bizId: values.bizId ? values.bizId.join(',') : '-1',
      id: this.state.operate != 'add' ? this.props.data.id : '',
      // requirementId : values.jiar +' '+values.requirementId,
      requirementId,
      description: values.description,
    };

    // 判断是否上传了xmind文件
    let xmindFile = this.state.xmindFile;

    let url = `${this.props.doneApiPrefix}/case/create`;
    if (xmindFile) {
      url = `${this.props.doneApiPrefix}/file/import`;
      params = new FormData();
      params.append('file', xmindFile);
      params.append('creator', getCookies('username'));
      params.append('title', values.case);
      params.append('productLineId', Number(this.props.productId));

      params.append('requirementId', requirementId);

      params.append('description', values.description);
      params.append('channel', 1);
      params.append('bizId', values.bizId ? values.bizId.join(',') : '-1');
    }
    request(url, { method: 'POST', body: params }).then(res => {
      if (res.code == 200) {
        message.success(
          this.state.operate == 'add'
            ? '新建测试场景集成功'
            : '复制测试场景集成功',
        );
        if (this.state.operate === 'add') {
          let urls = `${this.props.baseUrl}/caseManager/${this.props.productId}/${res.data}/undefined/0`;
          router.push(urls);
        }

        this.props.onClose(false);
        this.props.onUpdate && this.props.onUpdate();
      } else {
        message.error(res.msg);
      }
    });
  }
  // 确认重命名
  renameOk = values => {
    console.log(values);
    let requirementId = values.requirementId;
    // if (this.props.type == 'oe') {
    //   requirementId = values.requirementId
    //     .map(item => item.key.split('-')[0])
    //     .join(',');
    // }

    let params = {
      title: values.case,
      id: this.state.data.id,
      requirementId,
      caseType: 0,
      description: values.description,
      modifier: getCookies('username'),
      bizId: values.bizId ? values.bizId.join(',') : '-1',
      channel: 1,
    };

    let { type } = this.props;

    let url = `${this.props.doneApiPrefix}/case/edit`;
    request(url, { method: 'POST', body: params }).then(res => {
      if (res.code == 200) {
        this.props.onUpdate && this.props.onUpdate();
        message.success('更新成功');
      } else {
        message.error(res.msg);
      }
    });
  };
  renderTreeNodes = (data = []) =>
    data.map(item => {
      item.title = <span>{item.text}</span>;
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            value={item.id}
            key={item.id}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  render() {
    const { xmindFile, data, show, operate, bizIds } = this.state;
    const { getFieldDecorator } = this.props.form;
    const props = {
      accept: '.xmind',
      onRemove: file => {
        this.setState(state => ({ xmindFile: null }));
      },
      beforeUpload: file => {
        this.setState(state => ({ xmindFile: file }));
        const isLt2M = file.size / 1024 / 1024 <= 100;
        if (!isLt2M) {
          message.error('场景集文件大小不能超过100M');
        }
        return false;
      },
      fileList: xmindFile ? [xmindFile] : [],
    };
    let title = '';
    switch (operate) {
      case 'edit':
        title = '修改测试场景集';
        break;
      case 'add':
        title = '新增测试场景集';
        break;
      case 'copy':
        title = `复制测试场景集`;
        break;
      default:
        break;
    }
    // let newRequirementArr =
    //   requirementArr &&
    //   requirementArr.map(item => {
    //     // return {
    //     //   label: item.title,
    //     //   key: `${item.requirementId}-${item.title}`,
    //     // };
    //     return item.requirementId;
    //   });
    return (
      <Modal
        visible={show}
        onCancel={() => this.props.onClose && this.props.onClose(false)}
        onOk={this.handleOk}
        maskClosable={false}
        wrapClassName="oe-caseModal-style-wrap"
        title={title}
        okText="确认"
        cancelText="取消"
        width="700px"
      >
        <Form.Item {...formItemLayout} label="场景集名称：">
          {getFieldDecorator('case', {
            rules: [{ required: true, message: '请填写场景集名称' }],
            initialValue: data
              ? (operate == 'copy' && `copy of ${data.title}`) || data.title
              : '',
          })(<Input placeholder="请填写场景集名称" />)}
        </Form.Item>
        <Form.Item {...formItemLayout}  label="关联需求：" required>
          {/* <Form.Item
            style={{ display: 'inline-block', width: '100px' }}
            name="jiar"
          >
            {getFieldDecorator('jiar', {
              rules: [{ required: true, message: '请填写需求编号' }],
              initialValue: data ? data.requirementId.split(" ")[0] : undefined,
            })(
              <Input placeholder="需求编号" />
            )}
          </Form.Item> */}
          <Form.Item
            style={{ display: 'inline-block', width: '100%', marginLeft: '0px' }}
            name="requirementId"
          >
            {getFieldDecorator('requirementId', {
              rules: [{ required: true, message: '请填写关联需求' }],
              initialValue: data ? data.requirementId : undefined,
            })(
              <Input placeholder="关联需求" />
            )}
          </Form.Item>
        </Form.Item>
        <Form.Item {...formItemLayout} style={{ marginTop: '-30px' }} label="场景集分类：">
          {getFieldDecorator('bizId', {
            rules: [{ required: true, message: '请选择场景集分类' }],
            initialValue:
              this.state.operate === 'add'
                ? this.props.caseIds.length === 1 &&
                  this.props.caseIds[0] === 'root'
                  // ? [-1]
                  ? undefined
                  : this.props.caseIds
                : bizIds,
          })(
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择场景"
              allowClear
              multiple
              treeDefaultExpandAll
            >
              {this.renderTreeNodes(this.state.cardTree)}
            </TreeSelect>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="描述：">
          {getFieldDecorator('description', {
            initialValue: data ? data.description : '',
          })(<TextArea autoSize={{ minRows: 4 }} maxLength="1024" />)}
        </Form.Item>

        {operate == 'add' && (
          <Row style={{ marginBottom: '20px' }}>
            {/* <Col span={6}>导入本地xmind:</Col> */}
            <Form.Item {...formItemLayout} label="导入本地xmind：">
              <Col className="dragger">
                <div className="div-flex-child-1">
                  <Dragger {...props}>
                    {xmindFile === null ? (
                      <Icon
                        type="plus-circle"
                        style={{ color: '#447CE6', fontSize: '24px' }}
                      />
                    ) : (
                      <Icon
                        type="file"
                        style={{
                          color: '#447CE6',
                          fontSize: '24px',
                          position: 'relative',
                          top: '-15px',
                        }}
                      />
                    )}
                  </Dragger>
                </div>
                <div className="div-flex-child-2">
                  <div>
                    <span className="span-text span-text-bold">
                      上传文件（非必传）
                    </span>
                    <span className="span-text span-text-light">
                      仅支持.xmind扩展名文件...
                    </span>
                  </div>
                </div>
              </Col>
            </Form.Item>
          </Row>
        )}
      </Modal>
    );
  }
}
export default Form.create()(CaseModal);
