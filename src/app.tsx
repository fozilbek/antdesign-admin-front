import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
// src/app.ts
// const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
//   const authHeader = { Authorization: 'Bearer ' + getToken};
//   return {
//     url: `${url}`,
//     options: { ... options, interceptors: true, headers: authHeader }
//   };
//   };

// export const request: RequestConfig = {
//   errorHandler,
//   // Add a pre-request interceptor that automatically adds an AccessToken
//   requestInterceptors: [authHeaderInterceptor],
// };
/** When obtaining user information is slow, one will be displayed loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // If it is a login page, do not execute
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout Supported api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // If you are not logged in, redirect to login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI Documentation</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>Business component documentation</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // Custom 403 Page
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
