export declare interface Meta {
  keepAlive?: boolean;
  defaultMenu?: boolean;
  title?: string;
  icon?: string;
}

// getMenu 接口返回参数
export declare interface MenuListItem {
  CreatedAt?: string;
  ID?: number;
  UpdatedAt?: string;
  authoritys?: null;
  children?: MenuListItem[];
  component?: string;
  hidden?: boolean;
  menuId?: string;
  meta: Meta;
  name?: string;
  parameters?: [];
  parentId?: string;
  path: string;
  sort?: number;
  redirect?: string;
}

export declare interface MenuList {
  menus: MenuListItem[];
}
