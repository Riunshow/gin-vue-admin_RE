import { AuthorityItem } from '@/types'

// login or register参数
export declare interface LoginParams {
  username: string;
  password: string;
  captcha: string;
  captchaId: string;
}

// captcha
export declare interface Captcha {
  picPath: string;
  captchaId: string;
}

// userInfo类型
export declare interface UserInfo {
  CreatedAt?: string;
  ID?: number;
  UpdatedAt?: string;
  authority?: AuthorityItem;
  authorityId?: string;
  headerImg?: string;
  nickName?: string;
  username?: string;
  uuid?: string;
}

// login response
export declare interface LoginResponse {
  user: UserInfo;
  token: string;
  expiresAt: number;
}
