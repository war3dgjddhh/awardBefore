import { Button, Form, message, Spin, Tag } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import { ActionType } from '@ant-design/pro-table';
import { addUser, getUser, updateUser } from '@/services/system/user';
import { useState } from 'react';

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
  const icon = isUpdate ? <EditOutlined /> : <PlusOutlined />;
  const [loading, setLoading] = useState(isUpdate);
  let init: BasicApi.User | undefined;

  const visibleChangeHandler = async (visible: boolean) => {
    // console.log('userId', userId);
    if (isUpdate && visible && userId) {
      init = (await getUser(userId)).data.user;
      form.setFieldsValue({ ...init });
      setLoading(false);
    }
    console.log(init?.id);
    // console.log('visible改变了当前状态是:', visible);
  };
  const requestHandler = async (values: BasicApi.User) => {
    console.log('将要提交的数据', values);
    const data = {
      ...values,
      id: userId,
      // 创建时间
      createTime: moment().format('YYYY-MM-DD HH:MM:SS'),
      // deleteUserId: 1,
      createUserId: userId,
    };

    const { msg, code } = isUpdate ? await updateUser(data) : await addUser(data);
    if (code === 0) {
      message.success(msg);
      actionRef?.current?.reload();
    } else {
      message.error(msg);
    }
    return true;
  };
  function modelBody() {
    console.log('modalBody', loading);
    if (loading) return <Spin />;
    return (
      <>
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
      </>
    );
  }

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
      {modelBody()}
    </ModalForm>
  );
};
