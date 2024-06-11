/* eslint-disable */
import React from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import request from '@/utils/axios';
import {
  Table,
  Pagination,
  message,
  Modal,
  Checkbox,
  Icon,
  Menu,
  Dropdown,
  Tooltip,
} from 'antd';
import './index.scss';
import moment from 'moment';
import { getRequirmentAllInfos } from '@/utils/requirementUtils.js';
moment.locale('zh-cn');
import _ from 'lodash';
import PropTypes from 'prop-types';
import TaskModal from './taskModal';
import getQueryString from '@/utils/getCookies';
const getCookies = getQueryString.getCookie;
import debounce from 'lodash/debounce';
class Lists extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      total: 0, // 数据条数
      current: 1, // 当前第几页
      choiseDate: [], // 时间筛选最终选择
      iterationFilter: '', // 需求筛选最终选择
      createrFilter: '', // 创建人筛选最终选择
      nameFilter: '', // 用例名称筛选最终选择
      xmindFile: null, // 保存上传的file文件，单文件    };
      checked: false,
      requirementIds: [],
      requirementObj: [],
      taskVisible: false,
      record: null,
      extRecord: null,
      expendKeys: [],
      titleModeTask: '',
      loading: this.props.loading,
      extendLoading: new Map(),
      caseInfo: {},
      ownerList: [],
      userList: [],
      fetching: false,
      requirementSeach: '',
    };
    this.lastFetchId = 0;
    this.getOwnerList = debounce(this.getOwnerList, 800);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list != nextProps.list) {
      this.setState({ list: nextProps.list }, () => {
        this.setState({
          loading: nextProps.loading,
          current: this.props.current,
          choiseDate: this.props.choiseDate,
          iterationFilter: this.props.iterationFilter,
          createrFilter: this.props.createrFilter,
          nameFilter: this.props.nameFilter,
          expendKeys: [],
        });
      });
    }
  }
  delOk = record => {
    let { getTreeList } = this.props;
    let url = `${this.props.doneApiPrefix}/case/delete`;

    let params = {
      id: record.id,
    };
    request(url, {
      method: 'POST',
      body: params,
    }).then(res => {
      if (res.code === 200) {
        message.success('删除成功');
        // this.props.getCaseList(this.state.current, '', '', '', '');
        getTreeList();
        this.setState({ checked: false });
      } else {
        message.error(res.msg);
      }
      return null;
    });
  };

  onChangeCheckbox = e => {
    this.setState({ checked: e.target.checked });
  };

  setColumns = () => {
    const columns = [
      {
        title: '用例集ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: text => <div>{text}</div>,
      },
      {
        title: '用例集名称',
        dataIndex: 'title',
        key: 'title',
        width: 160,
        render: (text, record) => {
          let url = `${this.props.baseUrl}/caseManager/${this.props.productId}/${record.id}/undefined/0`;
          // return <Link to={url}>{text}</Link>;
          return (
            <Tooltip title={text}>
              <a className="table-ellipsis" href={url}>{text}</a>
            </Tooltip>
          );
        },
      },
      {
        title: '关联需求',
        dataIndex: 'requirementId',
        key: 'requirementId',
        width: 140,
        render: (text, record) => {
          // var JiraId = record.requirementId.split(" ")[0];
          // var JiraVar = record.requirementId.split(" ")[1];
          // var url = `${JiraId}`;
          return (
            <Tooltip title='点击查看'>
              <a href={record.requirementId} target="_blank ">点击查看</a>
            </Tooltip>
          );
        },
      },
      {
        title: () => (
          <Tooltip placement="top" title="用例集的总数">
            <span style={{ cursor: 'pointer' }}>用例总数</span>
          </Tooltip>
        ),
        dataIndex: 'totalNum',
        key: 'totalNum',
        align: 'center',
        width: 100,
        render: (text, record) => {
          console.log('record', record);
          return (
            <Tooltip title='用例总数'>
              <span className="table-operation">{this.state.caseInfo.totalCount}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        align: "center",
        width: 100,
        key: 'creator',
      },
      {
        title: '更新人',
        dataIndex: 'modifier',
        align: "center",
        width: 100,
        key: 'modifier',
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreated',
        width: 150,
        key: 'gmtCreated',
        render: text => {
          return (
            <div>
              <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        width: 150,
        key: 'gmtModified',
        render: text => {
          return (
            <div>
              <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        // width: 100,
        key: 'handle',
        render: (text, record) => {
          const { projectLs, requirementLs } = this.props.options;
          const { type } = this.props;

          let creator = getCookies('username');
          let recordCreator = record.creator.match(/\(([^)]*)\)/)
            ? record.creator.match(/\(([^)]*)\)/)[1]
            : record.creator;

          return (
            <span>
              <Tooltip title="编辑用例集">
                <a
                  onClick={() => {
                    let infos =
                      getRequirmentAllInfos(
                        projectLs,
                        requirementLs,
                        record.requirementId,
                      ) || {};
                    let project = infos.project || [];
                    let requirement = infos.requirement || [];
                    this.props.handleTask(
                      'edit',
                      record,
                      project,
                      requirement,
                      this.state.current,
                    );
                  }}
                  className="icon-bg border-a-redius-left"
                >
                  <Icon type="edit" />
                </a>
              </Tooltip>

              <Tooltip title="创建测试任务">
                <a
                  className="icon-bg"
                  onClick={() => {
                    this.showTask('新建测试任务', record);
                  }}
                >
                  <Icon type="file-done" />
                </a>
              </Tooltip>
              <Tooltip title="复制用例集">
                <a
                  onClick={() => {
                    let infos =
                      getRequirmentAllInfos(
                        projectLs,
                        requirementLs,
                        record.requirementId,
                      ) || {};
                    let project = infos.project || [];
                    let requirement = infos.requirement || [];
                    this.props.handleTask('copy', record, project, requirement);
                  }}
                  className="icon-bg border-a-redius-right margin-3-right"
                >
                  <Icon type="copy" />
                </a>
              </Tooltip>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <a
                        onClick={() => {
                          Modal.confirm({
                            title: '确认删除用例集吗',
                            content: (
                              <span>
                                当前正在删除&nbsp;&nbsp;
                                <span style={{ color: 'red' }}>
                                  {record.title}
                                </span>
                                &nbsp;&nbsp;用例集，并且删除用例集包含的{' '}
                                <span style={{ color: 'red' }}>
                                  {record.recordNum}
                                </span>{' '}
                                个测试任务与测试结果等信息，此操作不可撤销
                                <br />
                                <br />
                                <Checkbox onChange={this.onChangeCheckbox}>
                                  我明白以上操作
                                </Checkbox>
                              </span>
                            ),
                            onOk: e => {
                              if (this.state.checked) {
                                this.delOk(record);
                                Modal.destroyAll();
                              } else {
                                message.info('请先勾选我已明白以上操作');
                              }
                            },
                            icon: <Icon type="exclamation-circle" />,
                            cancelText: '取消',
                            okText: '删除',
                          });
                        }}
                      >
                        删除
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href={`/history/${record.id}`}>历史版本</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href={`/api/file/export?id=${record.id}`}
                        target="_blank"
                      >
                        导出xmind
                      </a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <a className="icon-bg border-around">
                  <Icon type="ellipsis" />
                </a>
              </Dropdown>
            </span>
          );
        },
      },
    ];
    return columns;
  };
  // 分页
  onChangePagination = page => {
    this.setState({ current: page, expendKeys: [] }, () => {
      const {
        nameFilter,
        createrFilter,
        iterationFilter,
        choiseDate,
      } = this.state;
      this.props.getCaseList(
        this.state.current,
        nameFilter || '',
        createrFilter || '',
        iterationFilter || '',
        choiseDate || [],
      );
    });
  };
  onCloseTask = form => {
    (this.state.ownerList = []), form.resetFields();
    this.setState({ taskVisible: false });
  };
  handleOkTask = record => {
    this.getRecordList(record.caseId || record.id);
    this.setState({
      taskVisible: false,
      expendKeys: [record.caseId || record.id],
    });
  };
  // priority 数据转换
  handleChooseContent = content => {
    let val = content && JSON.parse(content).priority;
    let val1 = val.indexOf('0') > -1 ? '0' : '1';
    return {
      content: val1,
      priority: val1 === '1' ? val : [],
    };
  };

  showTask = (title, record) => {
    let priority = record.chooseContent
      ? this.handleChooseContent(record.chooseContent).priority
      : [];
    let resource = record.chooseContent
      ? JSON.parse(record.chooseContent).resource
      : [];
    this.setState(
      { taskVisible: true, record: record, titleModeTask: title, caseInfo: {} },
      () => {
        this.getCaseInfo(priority, resource);
      },
    );
  };
  // 获取case信息
  getCaseInfo = (priority, resource) => {
    const { record, titleModeTask } = this.state;
    let url = `${this.props.doneApiPrefix}/case/countByCondition`;
    console.log(priority);
    request(url, {
      method: 'GET',
      params: {
        caseId: titleModeTask === '编辑测试任务' ? record.caseId : record.id,
        priority,
        resource: resource || [],
      },
    }).then(res => {
      if (res.code === 200) {
        this.setState({ caseInfo: res.data });
      }
    });
  };
  getCaseInfo1 = (record) => {
    let url = `${this.props.doneApiPrefix}/case/countByCondition`;
    request(url, {
      method: 'GET',
      params: {
        caseId:  record.id,
        priority: [],
        resource: [],
      },
    }).then(res => {
      if (res.code === 200) {
        this.setState({ caseInfo: res.data });
      }
    });
  };
  renderExpand = item => {
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: '任务名称',
        dataIndex: 'title',
        key: 'title',
        width: 160,
        render: (text, record) => {
          let url = `${this.props.baseUrl}/caseManager/${this.props.productId}/${record.caseId}/${record.id}/3`;
          return (
            <Tooltip title={text}>
              <a
                onClick={() => this.taskLink(url, record)}
                className="table-ellipsis"
              >
                {text}
              </a>
            </Tooltip>
          );
        },
      },
      {
        title: '失败',
        dataIndex: 'bugNum',
        key: 'bugNum',
        align: 'center',
        width: 40,
        render: (text, record) => (
          <span className="table-operation">
            {record.bugNum}
          </span>
        ),
      },
      {
        title: '受阻',
        dataIndex: 'blockNum',
        key: 'blockNum',
        align: 'center',
        width: 40,
        render: (text, record) => (
          <span className="table-operation">
            {record.blockNum}
          </span>
        ),
      },
      {
        title: '通过',
        dataIndex: 'successNum',
        key: 'successNum',
        align: 'center',
        width: 50,
        render: (text, record) => (
          <span className="table-operation">
            {record.successNum}
          </span>
        ),
      },
      {
        title: () => (
          <Tooltip placement="top" title="通过用例数的占比情况">
            <span style={{ cursor: 'pointer' }}>通过率</span>
          </Tooltip>
        ),
        dataIndex: 'successNum',
        key: 'passRate',
        align: 'center',
        width: 50,
        render: (text, record) => (
          <Tooltip placement="top" title="通过用例数/已执行用例数">
            <span className="table-operation">
              {text > 0 ? parseInt((text / record.executeNum) * 100) : 0}%
            </span>
          </Tooltip>
        )
      },
      {
        title: () => (
          <Tooltip placement="top" title="测试任务的用例执行情况">
            <span style={{ cursor: 'pointer' }}>执行情况</span>
          </Tooltip>
        ),
        dataIndex: 'executeNum',
        key: 'implementation',
        align: 'center',
        width: 100,
        render: (text, record) => (
          <Tooltip title="已执行 / 未执行 / 总用例数">
            <span className="table-operation">
              {text} / {record.totalNum - text} / {record.totalNum}
            </span>
          </Tooltip>
        ),
      },
      {
        title: () => (
          <Tooltip placement="top" title="当前测试任务的用例执行进度">
            <span style={{ cursor: 'pointer' }}>测试进度</span>
          </Tooltip>
        ),
        dataIndex: 'executeNum',
        key: 'testProgress',
        align: 'center',
        width: 65,
        render: (text, record) => (
          <Tooltip title="已执行用例数/总用例数">
            <span className="table-operation">
              {parseInt((record.executeNum / record.totalNum) * 100)}%
            </span>
          </Tooltip>
        ),
      },
      {
        title: () => (
          <Tooltip placement="top" title="负责执行任务的人员">
            <span style={{ cursor: 'pointer' }}>负责人</span>
          </Tooltip>
        ),
        dataIndex: 'owner',
        key: 'owner',
        align: 'center',
        width: 50,
        render: text => (
          <Tooltip title={text}>
            {/* <span >{text.replaceAll(",","<br/>")}</span> */}
            <span className="table-span">{text.replaceAll(",", "\n")}</span>
          </Tooltip>
        ),
      },
      {
        title: () => (
          <Tooltip placement="top" title="参与标记用例结果的人员">
            <span style={{ cursor: 'pointer' }}>执行人</span>
          </Tooltip>
        ),
        dataIndex: 'executors',
        key: 'executors',
        align: 'center',
        width: 60,
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: '开始时间',
        dataIndex: 'expectStartTime',
        key: 'expectStartTime',
        width: 70,
        render: (text, record) =>
          <span className="table-operation">
            {text ? `${moment(text).format('YYYY-MM-DD')}` : ''}
          </span>
      },
      {
        title: '结束时间',
        dataIndex: 'expectEndTime',
        key: 'expectEndTime',
        width: 70,
        render: (text, record) =>
          <span className="table-operation">
            {text ? `${moment(record.expectEndTime,).format('YYYY-MM-DD')}` : ''}
          </span>
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: 177,
        render: (text, record) => {
          let creator = getCookies('username');
          let recordCreator = record.creator.match(/\(([^)]*)\)/)
            ? record.creator.match(/\(([^)]*)\)/)[1]
            : record.creator;
          let url = `${this.props.baseUrl}/caseManager/${this.props.productId}/${record.caseId}/${record.id}/3`;

          return (
            <span>
              <Tooltip title="编辑任务">
                <a
                  onClick={() => {
                    this.showTask('编辑测试任务', record);
                  }}
                  className="icon-bg border-a-redius-left"
                >
                  <Icon type="edit" />
                </a>
              </Tooltip>
              <Tooltip title="执行测试">
                <a
                  className="icon-bg"
                  onClick={() => this.taskLink(url, record)}
                >
                  <Icon type="file-done" />
                </a>
              </Tooltip>
              <Tooltip title={`删除任务`}>
                <a
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除测试任务吗',
                      content: (
                        <span>
                          这将删除该测试任务下所有的测试与测试结果等信息，并且不可撤销。{' '}
                          <br />
                          <Checkbox onChange={this.onChangeCheckbox}>
                            我明白以上操作
                          </Checkbox>
                        </span>
                      ),
                      onOk: e => {
                        if (this.state.checked) {
                          this.deleteRecordList(record);

                          Modal.destroyAll();
                        } else {
                          message.info('请先勾选我已明白以上操作');
                        }
                      },
                      icon: <Icon type="exclamation-circle" />,
                      cancelText: '取消',
                      okText: '删除',
                    });
                  }}
                  className="icon-bg border-a-redius-right margin-3-right"
                >
                  <Icon type="delete" />
                </a>
              </Tooltip>
            </span>
          );
        },
      },
    ];
    return (
      <div className="recordTable" style={{ width: '104%' }}>
        {item.recordList &&
          item.recordList.length > 0 &&
          ((
            <Table
              columns={columns}
              dataSource={item.recordList}
              pagination={false}
              loading={this.state.extendLoading.get(item.id)}
              rowKey="id"
              size="middle"
            />
          ) ||
            null)}
      </div>
    );
  };
  // 任务名称跳转
  taskLink = (url, record) => {
    let loginUser = getCookies('username');
    if (record.owner === '' || record.owner.indexOf(loginUser) > -1) {
      router.push(url);
    } else {
      this.showConfirm(url);
    }
  };
  // 任务名称跳转、执行测试confirm弹框
  showConfirm = url => {
    return Modal.confirm({
      title: '您不是当前测试任务指派的负责人，确认要执行该任务？',
      onOk() {
        router.push(url);
      },
      onCancel() { },
      icon: <Icon type="question-circle" style={{ color: '#1890FF' }} />,
      cancelText: '取消',
      okText: '确认',
    });
  };
  getOwnerList = value => {
    if (!value) {
      return;
    }
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ requirementSeach: value, fetching: true });
    request(`${this.props.oeApiPrefix}/user/suggest`, {
      method: 'GET',
      params: {
        username: value,
        onlyEmployee: false,
      },
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      if (res.code === 200) {
        this.setState({ ownerList: res ? res : [], fetching: false });
      }
    });
  };
  getUserList = value => {
    this.setState({ requirementSeach: value, fetching: true });
    request(`${this.props.oeApiPrefix}/user/getUserList`, {
      method: 'GET',
      params: {
        isDelete: 0,
        username: value
      },
    }).then(res => {
      if (res.code === 200) {
        this.setState({ userList: res.data ? res.data : [], fetching: false });
      }
    });
  };
  clearRequire = () => {
    this.setState({ userList: [], requirementSeach: '' });
  };
  onExpand = (expanded, record) => {
    if (expanded) {
      this.setState({ record }, () => { });
    }
  };
  getRecordList = id => {
    let url = `${this.props.doneApiPrefix}/record/list`;

    request(url, { method: 'GET', params: { caseId: id } }).then(res => {
      if (res.code == 200) {
        let { list } = this.state;
        list.map(item => {
          if (item.id === id) {
            item.recordList = res.data;
            item.recordNum = res.data.length;
            if (item.recordNum === 0) {
              this.setState({ expendKeys: [] });
            }
          }
        });

        this.setState({ list }, () => {
          let extendLoading = this.state.extendLoading.set(id, false);

          this.setState({
            extendLoading,
          });
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  // /record/delete
  deleteRecordList = record => {
    let url = `${this.props.doneApiPrefix}/record/delete`;

    request(url, { method: 'POST', body: { id: record.id } }).then(res => {
      if (res.code == 200) {
        this.getRecordList(record.caseId);
        this.setState({ checked: false });
        message.success(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };
  seeDetail = props => {
    let { expendKeys } = this.state;

    if (expendKeys.length > 0) {
      if (
        expendKeys.some(item => {
          return item == props.record.id;
        })
      ) {
        expendKeys.map(item => {
          if (item == props.record.id) {
            expendKeys.splice(expendKeys.indexOf(item), 1);
          }
        });
      } else {
        expendKeys.push(props.record.id);
      }
    } else {
      expendKeys.push(props.record.id);
    }
    this.setState({ expendKeys }, () => {
      if (!props.expanded) {
        this.getRecordList(props.record.id);
      }
    });
  };

  render() {
    const {
      list,
      current,
      expendKeys,
      // loading,
      requirementSeach,
      fetching,
      ownerList,
      userList,
    } = this.state;
    const { total, loading } = this.props;
    return (
      <div>
        <Table
          columns={this.setColumns()}
          dataSource={list}
          expandedRowRender={item => this.renderExpand(item)}
          className="table-wrap"
          onExpand={this.onExpand}
          expandedRowKeys={expendKeys}
          rowKey="id"
          size="middle"
          loading={loading}
          pagination={false}
          expandIcon={props => {
            if (props.record.recordNum > 0) {
              if (!props.expanded) {
                return (
                  <div
                    role="button"
                    tabIndex="0"
                    className="ant-table-row-expand-icon ant-table-row-collapsed"
                    aria-label="展开行"
                    onClick={() => {
                      let extendLoading = this.state.extendLoading.set(
                        props.record.id,
                        true,
                      );

                      this.setState({ extendLoading });
                      this.seeDetail(props);
                    }}
                  ></div>
                );
              } else {
                return (
                  <div
                    role="button"
                    tabIndex="0"
                    className="ant-table-row-expand-icon ant-table-row-expanded"
                    aria-label="关闭行"
                    onClick={() => {
                      this.seeDetail(props);
                    }}
                  ></div>
                );
              }
            } else {
              return null;
            }
          }}
          footer={currentData => (
            <div style={{ height: '32px' }}>
              {
                <div
                  className="pagination"
                  style={{
                    display: total === 0 ? 'none' : 'block',
                    float: 'right',
                  }}
                >
                  <Pagination
                    onChange={this.onChangePagination}
                    current={current}
                    total={Number(total)}
                    pageSize={10}
                  />
                </div>
              }
            </div>
          )}
        />
        <TaskModal
          key="id"
          visible={this.state.taskVisible}
          caseInfo={this.state.caseInfo}
          onClose={this.onCloseTask}
          handleOkTask={this.handleOkTask}
          showTask={this.showTask}
          getOwnerList={this.getOwnerList}
          ownerList={ownerList}
          getUserList={this.getUserList}
          userList={userList}
          fetching={fetching}
          requirementSeach={requirementSeach}
          clearRequire={this.clearRequire}
          record={this.state.record}
          type={this.props.type}
          doneApiPrefix={this.props.doneApiPrefix}
          titleModeTask={this.state.titleModeTask}
          getCaseInfo={this.getCaseInfo}
        />
      </div>
    );
  }
}
export default Lists;
