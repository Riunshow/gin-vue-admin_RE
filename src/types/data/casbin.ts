export declare interface CasbinInfo {
  method: string;
  path: string;
}

export declare interface CasbinRequest {
  authorityId: string;
  casbinInfos: CasbinInfo;
}

export declare interface CasbinResponse {
  paths: CasbinInfo[]
}
