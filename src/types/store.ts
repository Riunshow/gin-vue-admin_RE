import { RouterItem, MenuListItem, UserInfo } from '@/types'

export declare interface UserState {
  token: string;
  userInfo: UserInfo;
}

export declare interface RouterState {
  asyncRouters: MenuListItem[];
  routerList: RouterItem[];
}
