export declare interface AuthorityItem {
  CreatedAt?: string;
  DeletedAt?: null;
  UpdatedAt?: string;
  authorityId: string;
  authorityName: string;
  children: AuthorityItem[];
  dataAuthorityId: AuthorityItem[];
  menus: null;
  parentId: string;
}

export declare interface Authority {
  authority: AuthorityItem;
}

export declare interface DeleteAuthorityItem {
  authorityId: string;
}

export declare interface EditAuthorityItem {
  authorityId: string;
  authorityName: string;
  parentId: string;
}

export declare interface CopyAuthorityItem {
  oldAuthorityId: string;
  authority: AuthorityItem;
}
