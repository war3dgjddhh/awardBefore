/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: User.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    Admin:
      currentUser &&
      currentUser.authorities.find((item) => {
        return item.authority === 'ROLE_ADMIN';
      }),
  };
}
