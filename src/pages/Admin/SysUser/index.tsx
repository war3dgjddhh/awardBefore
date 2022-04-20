import { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  DatePicker,
  Popconfirm,
  Select,
  Modal as AntdModal,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import moment from 'moment';
const { confirm } = AntdModal;
import { listUser, delUser } from '@/services/system/user';
import Modal from './Modal';
import { AlertRenderType } from '@ant-design/pro-table/lib/components/Alert';
import { ExclamationCircleOutlined } from '@ant-design/icons';
export default () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [, setSelectedRows] = useState([]);
  const columns: ProColumns<BasicApi.User>[] = [
    {
      title: '用户id',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      render: (dom) => {
        return <Tag color={dom ? 'blue' : 'red'}>{dom ? 'true' : 'false'}</Tag>;
      },
      renderFormItem: () => {
        return (
          <Select defaultValue="1" style={{ width: 120 }}>
            <Select.Option value="1">启用</Select.Option>
            <Select.Option value="0">禁用</Select.Option>
          </Select>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      renderFormItem: () => {
        return (
          <DatePicker.RangePicker
            showTime
            style={{ width: '100%' }}
            ranges={{
              Today: [moment().startOf('day'), moment().endOf('day')],
              'Last 7 Days': [moment().subtract(7, 'd'), moment()],
              'Last 30 Days': [moment().subtract(30, 'days'), moment()],
              'Last Month': [
                moment().subtract(1, 'months').startOf('month'),
                moment().subtract(1, 'months').endOf('month'),
              ],
            }}
          />
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'options',
      render: (_, record) => {
        return (
          <Space>
            <Modal isUpdate userId={record.id} actionRef={actionRef} />
            <Popconfirm
              title={`是否确定删除用户编号为${record.id}的数据项?`}
              okText="确定"
              onConfirm={() => {
                deleleHandler(record.id);
              }}
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
            <Button>更多</Button>
          </Space>
        );
      },
    },
  ];
  const rowSelection = {
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    defaultSelectedRowKeys: [1],
    selectedRowKeys,
    onChange: (_selectedRowKeys: any, _selectedRows: any) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedRows(_selectedRows);
    },
  };

  function deleleHandler(id: number) {
    console.log('id', id);
    delUser([id]);
  }

  const tableAlertRenderHandler: AlertRenderType<BasicApi.User> = ({
    selectedRowKeys,
    selectedRows,
    onCleanSelected,
  }) => {
    return (
      <Space size={24}>
        <span>
          已选 <strong>{selectedRowKeys.length}</strong> 项
          <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
            取消选择
          </a>
        </span>
      </Space>
    );
  };
  /**
   * table alert部分的批量删除按钮点击事件
   */
  function batchDeleteHandler(selectedRows: BasicApi.User[]) {
    const userIds: number[] = [];
    selectedRows.forEach((user) => {
      userIds.push(user.id);
    });
    confirm({
      title: `你确定要删除 ${selectedRows.length} 项?`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        delUser(userIds).then((res) => {
          message.success('删除成功');
          actionRef.current?.reload;
          setSelectedRowKeys([]);
          setSelectedRows([]);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const proTableRequestHandler = async (
    _params: BasicApi.User & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
  ) => {
    const { createTime, ...params } = { ..._params };
    const isSearch = Array.isArray(createTime);
    if (isSearch) {
      params.params = {
        beginTime: createTime[0],
        endTime: createTime[1],
      };
    }
    return listUser(_params);
    // return request(`/api/user/list`, {
    //   params: isSearch ? params : _params,
    //   paramsSerializer: function (params) {
    //     console.log(qs.stringify(params, { arrayFormat: 'brackets' }));
    //     return qs.stringify(params, { arrayFormat: 'brackets' });
    //   },
    // });
  };
  const tableAlertOptionHandler: AlertRenderType<BasicApi.User> = ({
    selectedRowKeys,
    selectedRows,
    onCleanSelected,
  }) => {
    return (
      <Space size={16}>
        <a
          onClick={() => {
            batchDeleteHandler(selectedRows);
          }}
        >
          批量删除
        </a>
        <a>导出数据</a>
      </Space>
    );
  };
  const tableToolBar = () => {
    return [<Modal actionRef={actionRef} />];
  };
  return (
    <PageContainer>
      <ProTable<BasicApi.User, BasicApi.User>
        rowSelection={rowSelection}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        tableAlertRender={tableAlertRenderHandler}
        tableAlertOptionRender={tableAlertOptionHandler}
        request={(_params) => {
          return proTableRequestHandler(_params);
        }}
        editable={{ type: 'multiple' }}
        rowKey="id"
        headerTitle="高级表格"
        toolBarRender={tableToolBar}
      />
    </PageContainer>
  );
};
