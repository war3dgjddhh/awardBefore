import { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Popconfirm, Select, Space, Tag } from 'antd';
import { request } from 'umi';
import moment from 'moment';
import qs from 'qs';
import Modal from './Modal';
export default () => {
  const actionRef = useRef<ActionType>();
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
              cancelText="取消"
            >
              <Button
                onClick={() => {
                  actionHandler(record.id);
                }}
              >
                删除
              </Button>
            </Popconfirm>
            <Button>更多</Button>
          </Space>
        );
      },
    },
  ];
  function actionHandler(id: number) {
    console.log('id', id);
    request(`/api/user/${[id]}`, {
      method: 'delete',
    });
  }
  const tableToolBar = () => {
    return [<Modal actionRef={actionRef} />];
  };
  return (
    <PageContainer>
      <ProTable<BasicApi.User, BasicApi.User>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (_params) => {
          const { createTime, ...params } = { ..._params };
          const isSearch = Array.isArray(createTime);
          if (isSearch) {
            params.params = {
              beginTime: createTime[0],
              endTime: createTime[1],
            };
          }
          return request(`/api/user/list`, {
            params: isSearch ? params : _params,
            paramsSerializer: function (params) {
              console.log(qs.stringify(params, { arrayFormat: 'brackets' }));
              return qs.stringify(params, { arrayFormat: 'brackets' });
            },
          });
        }}
        editable={{ type: 'multiple' }}
        rowKey="id"
        headerTitle="高级表格"
        toolBarRender={tableToolBar}
      />
    </PageContainer>
  );
};
