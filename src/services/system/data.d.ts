declare namespace User {
  type LoginResult = {
    code?: number;
    msg?: string;
    data?: string;
  };
  export type Role = {
    createUserId: number;
    lastModifyTime: string;
    params: Param;
    name: string;
    label: string;
    menuCheckStrictly: boolean;
    enable: boolean;
    delFlag: string;
  };

  export type Authority = {
    authority: string;
  };

  export type CurrentUser = {
    createTime: string;
    createUserId: number;
    lastModifyTime: string;
    params: Param;
    id: number;
    username: string;
    nickname: string;
    email: string;
    mobilePhone: string;
    position: string;
    fullName: string;
    address: string;
    roles: Role[];
    enable: string;
    delFlag: string;
    enabled: boolean;
    authorities: Authority[];
    admin: boolean;
  };

  export type RootObject = {
    code: number;
    msg: string;
    data: Data;
  };
}
