/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Row, Button, Col, message, Tooltip } from 'antd';
import './index.scss';
import request from '@/utils/axios';
import getQueryString from '@/utils/getCookies';
const getCookies = getQueryString.getCookie;
import moment from 'moment';
import Link from 'umi/link';
import AgileTCEditor from 'react-agiletc-editor';
/* global staffNamePY */
export default class CaseMgt extends React.Component {
  static propTypes = {
    params: PropTypes.any,
    form: PropTypes.any,
    productId: PropTypes.any,
    updateCallBack: PropTypes.any,
    activeProductObj: PropTypes.any,
  };
  constructor(props) {
    super(props);
    this.state = {
      modaltitle: '',
      visibleStatus: false,
      visible: false,
      title: '',
      caseContent: '',
      id: 0,
      productId: 0,
      recordDetail: null,
      casedetail: null,
      requirementObj: [],
    };
  }
  componentDidMount() {
    const { iscore } = this.props.match.params;
    if (iscore === '3') {
      this.getContentById();
    } else {
      this.getCaseById();
    }
  }
  componentWillMount() {
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', this.handleAutoSave);
  }
  componentWillUnmount() {
    // 销毁拦截判断是否离开当前页面
    window.removeEventListener('beforeunload', this.handleAutoSave);
    this.handleAutoSave();
  }
  //case/getRequirement
  handleAutoSave = () => {
    const { iscore } = this.props.match.params;
    const minderData = this.editorNode
      ? this.editorNode.getAllData()
      : { base: 0 };
    // 是否有ws链接断开弹窗
    const hasBreak =
      document.getElementsByClassName('ws-warning') &&
      document.getElementsByClassName('ws-warning').length > 0;
    if (Number(iscore) !== 2 && minderData && !hasBreak) {
      // 非冒烟case才可保存
      if (Number(minderData.base) > 1) {
        message.warn('即将离开页面，自动保存当前用例。');
        this.updateCase();
      }
    }
  };
  getRequirementsById = requirementIds => {
    // request(`${this.props.oeApiPrefix}/business-lines/requirements`, {
    //   method: 'GET',
    //   params: { requirementIds: requirementIds },
    // }).then(res => {
    //   this.setState({ requirementObj: res, loading: false });
    // });
  };

  getCaseById = () => {
    let url = `${this.props.doneApiPrefix}/case/getCaseInfo`;
    request(url, {
      method: 'GET',
      params: { id: this.props.match.params.caseId },
    }).then(res => {
      if (res.code == 200) {
        this.setState(
          {
            casedetail: res.data,
          },
          () => {
            this.state.casedetail.requirementId &&
              this.getRequirementsById(this.state.casedetail.requirementId);
          },
        );
      } else {
        message.error(res.msg);
        this.props.history.push('/case/caseList/1');
      }
    });
  };

  ///record/getContentById
  getContentById = () => {
    let url = `${this.props.doneApiPrefix}/record/getRecordInfo`;
    request(url, {
      method: 'GET',
      params: { id: this.props.match.params.itemid },
    }).then(res => {
      if (res.code == 200) {
        this.setState({ recordDetail: res.data });
      } else {
        message.error(res.msg);
      }
    });
  };

  //返回列表
  returnCaseList = () => {
    // this.props.history.push('/case/caseList/1')
    window.history.back();
    // window.history.go(-1);
  };

  //保存用例
  updateCase = () => {
    let recordId =
      this.props.match.params.itemid == 'undefined'
        ? undefined
        : this.props.match.params.itemid;

    const param = {
      id: this.props.match.params.caseId,
      title: '更新内容，实际不会保存title',
      recordId,
      modifier: getCookies('username'),
      caseContent: JSON.stringify(this.editorNode.getAllData()),
    };
    let url = `${this.props.doneApiPrefix}/case/update`;
    request(url, { method: 'POST', body: param }).then(res => {
      if (res.code == 200) {
        message.success('保存内容成功');
        // location.reload();
      } else {
        message.error(res.msg);
      }
    });
  };

  //清除执行记录
  clearRecord = () => {
    const params = {
      id: this.props.match.params.itemid,
      modifier: getCookies('username'),
    };

    let url = `${this.props.doneApiPrefix}/record/clear`;
    request(url, { method: 'POST', body: params }).then(res => {
      if (res.code == 200) {
        message.success('清除执行记录成功');
        this.editorNode.setEditerData(JSON.parse(res.data.caseContent));
      } else {
        message.error(res.msg);
      }
    });
  };

  render() {
    //this.props.match.params.iscore  0:需求case  3:执行记录详情
    const { match } = this.props;
    const { iscore, caseId, itemid } = match.params;
    const user = getCookies('username');
    const { recordDetail, casedetail } = this.state;
    let readOnly = false;
    let progressShow = false;
    if (iscore === '0' || iscore === '1') {
      readOnly = false;
      progressShow = false;
    } else {
      readOnly = true;
      progressShow = true;
    }
    return (
      <div style={{ position: 'relative', minHeight: '80vh' }}>
        <Breadcrumb style={{ marginBottom: 8, fontSize: 12 }}>
          <Breadcrumb.Item>
            <Link to="/case/caseList/1">
              {casedetail ? '用例' : '任务'}管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {casedetail ? '用例' : '任务'}详情：
            {recordDetail ? recordDetail.title : ''}
            {casedetail ? casedetail.title : ''}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 12,
            background: '#fff',
          }}
        >
          {(recordDetail && (
            <Row>
              <Col span={6} className="description-case elipsis-case">
                <Tooltip
                  title={recordDetail.description}
                  placement="bottomLeft"
                >
                  {recordDetail.description}
                </Tooltip>
              </Col>
              <Col span={1}></Col>

              <Col span={2} className="font-size-12">
                通过率: {recordDetail.passRate.toFixed(2) + '%'}
              </Col>
              <Col span={2} className="font-size-12">
                {' '}
                已测: {recordDetail.passCount + '/' + recordDetail.totalCount}
              </Col>
              <Col
                span={4}
                style={{ textAlign: 'center' }}
                className="progress"
              >
                <div>
                  {(
                    <Tooltip
                      title={`通过:${recordDetail.successCount} (${(
                        (recordDetail.successCount / recordDetail.totalCount) *
                        100
                      ).toFixed(2)}%)`}
                      className="font-size-12"
                    >
                      <div
                        className="div-wrap"
                        style={{
                          width: `${(recordDetail.successCount /
                            recordDetail.totalCount) *
                            100}%`,
                          backgroundColor: '#61C663',
                        }}
                      >
                        <span></span>
                      </div>
                    </Tooltip>
                  ) || null}
                  {(recordDetail.blockCount > 0 && (
                    <Tooltip
                      title={`阻塞:${recordDetail.blockCount} (${(
                        (recordDetail.blockCount / recordDetail.totalCount) *
                        100
                      ).toFixed(2)}%)`}
                      className="font-size-12"
                    >
                      <div
                        className="div-wrap"
                        style={{
                          width: `${(recordDetail.blockCount /
                            recordDetail.totalCount) *
                            100}%`,
                          backgroundColor: '#85A1D6',
                        }}
                      >
                        <span></span>
                      </div>
                    </Tooltip>
                  )) ||
                    null}
                  {(recordDetail.bugNum > 0 && (
                    <Tooltip
                      title={`失败:${recordDetail.bugNum} (${(
                        (recordDetail.bugNum / recordDetail.totalCount) *
                        100
                      ).toFixed(2)}%)`}
                    >
                      <div
                        className="div-wrap"
                        style={{
                          width: `${(recordDetail.bugNum /
                            recordDetail.totalCount) *
                            100}%`,
                          backgroundColor: '#FF7575',
                        }}
                      >
                        <span></span>
                      </div>
                    </Tooltip>
                  )) ||
                    null}
                  {(recordDetail.totalCount - recordDetail.passCount > 0 && (
                    <Tooltip
                      title={`未执行:${recordDetail.totalCount -
                        recordDetail.passCount} (${(
                          ((recordDetail.totalCount - recordDetail.passCount) /
                            recordDetail.totalCount) *
                          100
                        ).toFixed(2)}%)`}
                    >
                      <div
                        className="div-wrap"
                        style={{
                          width: `${((recordDetail.totalCount -
                            recordDetail.passCount) /
                            recordDetail.totalCount) *
                            100}%`,
                          backgroundColor: '#EDF0FA',
                        }}
                      >
                        <span></span>
                      </div>
                    </Tooltip>
                  )) ||
                    null}
                </div>
              </Col>
              <Col span={1}></Col>
              <Col span={2} className="font-size-12">
                计划周期:
              </Col>
              <Col span={4} className="font-size-12">
                {recordDetail.expectStartTime
                  ? moment(recordDetail.expectStartTime).format('YYYY/MM/DD')
                  : null}
                -{' '}
                {recordDetail.expectEndTime
                  ? moment(recordDetail.expectEndTime).format('YYYY/MM/DD')
                  : null}
              </Col>
            </Row>
          )) ||
            null}

          {(casedetail && (
            <Row>
              <Col span={6} className="description-case elipsis-case">
                <Tooltip title={casedetail.description} placement="topLeft">
                  {casedetail.description}
                </Tooltip>
              </Col>
              <Col span={1}></Col>
              <Col span={2} className="font-size-12">
                关联需求:
              </Col>
              <Col span={14} className="font-size-12">
                {casedetail ? casedetail.requirementId : ''}
              </Col>
            </Row>
          )) ||
            null}
          <div
            style={{
              display: 'inline-block',
              position: 'fixed',
              bottom: '30px',
              right: '20px',
              zIndex: 999,
            }}
          >
            <Button type="primary" onClick={this.returnCaseList}>
              返回
            </Button>
            <span> &nbsp; &nbsp;</span>
            {iscore != 2 && (
              <Button type="primary" onClick={this.updateCase}>
                保存
              </Button>
            )}
            <span> &nbsp; &nbsp;</span>
            {iscore == 3 && (
              <Button type="primary" onClick={this.clearRecord}>
                清除执行记录
              </Button>
            )}
          </div>
          <AgileTCEditor
            ref={editorNode => (this.editorNode = editorNode)}
            tags={['前置条件', '执行步骤', '预期结果']} //标签列表
            progressShow={progressShow} //工具栏是否展示结果
            readOnly={readOnly} //脑图是否可编辑
            mediaShow={!progressShow}
            priority={[1, 2, 3]} //优先级列表	
            editorStyle={{ height: 'calc(100vh - 100px)' }} //编辑器样式(高度等)
            toolbar={{
              image: true,
              theme: [ //主题
                'classic',             //脑图经典
                'classic-compact',     //紧凑经典
                'snow',                //温柔冷光
                'snow-compact',        //紧凑冷光
                'fish',                //鱼骨图
                'wire',                //线框
                'fresh-red',           //清新红
                'fresh-soil',          //泥土黄
                'fresh-green',         //文艺绿
                'fresh-blue',          //天空蓝
                'fresh-purple',        //浪漫紫
                'fresh-pink',          //脑残粉
                'fresh-red-compat',    //紧凑红
                'fresh-soil-compat',   //紧凑黄
                'fresh-green-compat',  //紧凑绿
                'fresh-blue-compat',   //紧凑蓝
                'fresh-purple-compat', //紧凑紫
                'fresh-pink-compat',   //紧凑粉
                'tianpan',             //经典天盘
                'tianpan-compact',     //紧凑天盘
              ],
              template: [ //布局
                'default',   //思维导图
                'right',     //逻辑结构图
                'fish-bone', //鱼骨头图
                'tianpan',   //天盘图
                'structure', //组织结构图
                'filetree',  //目录组织图
              ],
              noteTemplate: '# test', //备注模板
            }}
            baseUrl="" //图片上传请求域名
            uploadUrl="/api/file/uploadAttachment" //图片上传请求接口
            wsUrl={`wss://${window.location.host}/api/case/${caseId}/${itemid}/${iscore}/${user}`} //websocket 请求地址
            // type={compare} //是否为只查看 xmind 数据,type 为 compare 时只读
            onSave={ //保存快捷键方法回调,回传脑图全部数据
              Number(iscore) !== 2
                ? () => {
                  message.loading('保存中......', 1);
                  this.updateCase();
                }
                : null
            }
          />
        </div>
      </div>
    );
  }
}
