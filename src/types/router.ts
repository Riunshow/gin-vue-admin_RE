import { RouteRecordRaw } from 'vue-router'

export declare interface AppRouteMetaConfig {
  title?: string;
  auth?: boolean;
}

export declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  meta?: AppRouteMetaConfig;
}

export declare interface RouteLocation {
  path: string;
  name?: string;
  redirect?: string;
  meta: AppRouteMetaConfig;
}
