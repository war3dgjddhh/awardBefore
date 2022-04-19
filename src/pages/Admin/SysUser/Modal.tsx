import { Button, Form, message, Tag } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import request from 'umi-request';
import { ActionType } from '@ant-design/pro-table';

export default ({
  userId,
  isUpdate,
  actionRef,
}: {
  userId?: number;
  isUpdate?: boolean;
  actionRef: React.MutableRefObject<ActionType | undefined>;
}) => {
  isUpdate = isUpdate || false;
  const [form] = Form.useForm<BasicApi.User>();
  const keyword = isUpdate ? '修改' : '创建';
  const method = isUpdate ? 'put' : 'post';
  const icon = isUpdate ? <EditOutlined /> : <PlusOutlined />;
  let init: BasicApi.User | undefined;

  const visibleChangeHandler = async (visible: boolean) => {
    // console.log('userId', userId);
    if (isUpdate && visible) {
      init = (await request.get(`/api/user/${userId}`)).data.user;
      form.setFieldsValue({ ...init });
      console.log(init);
    }
    console.log(init?.id);
    // console.log('visible改变了当前状态是:', visible);
  };
  const requestHandler = async (values: BasicApi.User) => {
    console.log('将要提交的数据', values);
    const { msg, code } = await request('/api/user', {
      method,
      data: {
        ...values,
        id: userId,
        // 创建时间
        createTime: moment().format('YYYY-MM-DD HH:MM:SS'),
        deleteUserId: 1,
        createUserId: 1,
      },
    });
    if (code === 0) {
      message.success(msg);
      actionRef?.current?.reload();
    } else {
      message.error(msg);
    }
    return true;
  };
  return (
    <ModalForm<BasicApi.User>
      title={`${keyword}用户`}
      form={form}
      size="large"
      trigger={
        <Button type="primary">
          {/*图标*/ icon}
          {keyword}
        </Button>
      }
      autoFocusFirstInput
      onVisibleChange={visibleChangeHandler}
      modalProps={{
        width: 520,

        onCancel: () => console.log('run'),
      }}
      submitter={{
        render: (_, doms) => {
          return (
            <>
              {doms}
              <Tag className={styles.create_time}>
                {'创建时间' + ' ' + moment().format('YYYY-MM-DD HH:MM:SS')}
              </Tag>
            </>
          );
        },
      }}
      onFinish={requestHandler}
    >
      <ProForm.Group>
        <ProFormText width="sm" name="username" label="用户名" />
        <ProFormText width="sm" name="nickname" label="用户昵称" />
        <ProFormText width="sm" name="fullName" label="真实姓名" hidden={isUpdate} />
        <ProFormText width="sm" name="password" label="用户密码" hidden={isUpdate} />
        <ProFormText width="sm" name="mobilePhone" label="手机号" />
        <ProFormText width="sm" name="email" label="邮箱" />
        <ProFormSelect
          request={async () => [
            {
              value: '1',
              label: '启用',
            },
            {
              value: '0',
              label: '禁用',
            },
          ]}
          width="xs"
          name="enable"
          label="状态"
        />
      </ProForm.Group>
    </ModalForm>
  );
};
