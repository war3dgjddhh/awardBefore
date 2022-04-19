declare namespace BasicApi {
  type User = {
    id: number;
    username: string;
    nickname: string;
    mobilePhone: string;
    email: string;
    enable: boolean;
    createTime: string;
    enabled: boolean;
    authorities: any[];
    params: object;
  };
}
