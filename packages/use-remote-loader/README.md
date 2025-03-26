# @zenstone/use-remote-loader

A hook for load remote resources in react.

React 外部资源加载器 Hook 。

## 基本概念

主要利用 `fetch` 的 stream reader 的机制实现可观测的下载进度条，并利用浏览器自身的缓存机制，加速二次加载。

一个正常启动的 loader 可以把流程简单的分为以下几个阶段：

1. prepare 准备阶段 - 资产准备阶段，确定哪些资产需要预载
2. preload 预载载阶段 - fetch download 实现预载
3. mount 挂载阶段 - js/css，会加载到 DOM head 部分，wasm/json/blobUrl
   等，会以结果集在回调函数中返回
4. complete 完成阶段 - 完成全部流程

同 key 的 loader，只会开始其中一个，其他处于排队中。

不同 key 的 loader 不会排队。

## 配置参数

```ts
export type RemoteLoaderAssetsProps<Query = object> = {
  // loader 实例名，不会动态更新，第一次输入就会固定
  // 假定同时启动两个同 key 的 loader ，只会第一个开始加载，第二个会处于等待中的状态，更多的同理。
  key: string;
  // 基础 url
  baseUrl?: string | URL;
  // 关联资产
  assets: RemoteAsset[];
  // 查询参数，输入时可以是任意 object，取用时再推断类型
  query?: Partial<Query>;
  // 是否启用 fetch download ，默认为 true，不起用则下载进度无效
  isFetchDownload?: boolean;
  // http 请求是否 compressed ，针对 js/css 等压缩的推算算法的启用
  // 有些静态文件服务器，不会输出 encoding header，需要手动启用
  isCompressed?: boolean;
};

export type RemoteLoaderCallbacks<Query = object> = {
  // 加载 remote 资源时生成 ID 的算法重载
  makeId?: (params: RemoteMakeIdParams) => string;
  // 生成即将发起 fetch download 的资产的前置方法
  onPrepare?: (params: RemotePrepareAssetsParams<Query>) => MaybePromise<void>;
  // 判断该资产是否需要加载的判断方法
  shouldPreload?: (params: RemoteShouldPreloadParams<Query>) => boolean;
  // 判断该资产是否需要重载的判断方法
  shouldReload?: (params: RemoteShouldReloadParams<Query>) => boolean;
  // 每一个资产 fetch download 完成时触发
  onDownloadAsset?: (
    params: RemoteOnDownloadAssetParams<Query>,
  ) => MaybePromise<void>;
  // 全部资产都 fetch download 完成时触发
  onPreload?: (params: RemotePreloadAssetsParams<Query>) => MaybePromise<void>;
  // 接管 preload 的处理方法，该方法将彻底接管 fetch download 完毕后的资产管理方法
  // handlePreload/internalHandlePreload 将根据预载的结果生成对应的结果集
  // 主要分为 mount/wasm/blobUrl/text/json/errors 几种结果
  handlePreload?: (
    params: RemotePreloadAssetsParams<Query>,
  ) => MaybePromise<RemoteResultSet>;
  // 用于挂载前拦截，针对js/css
  willMount?: (
    params: RemoteWillMountAssetsParams<Query>,
  ) => MaybePromise<void>;
  // 在挂载完成后
  onMount?: (params: RemoteOnMountAssetsParams<Query>) => MaybePromise<void>;
  // 如果是重载资源，且存在已挂载的同ID资源，会触发unmount，先移除
  onUnmount?: () => void;
  // 最终完成前回调
  onLoad?: (params: RemoteOnLoadAssetsParams<Query>) => MaybePromise<void>;
  // 发生错误时的回调
  onError?: (err: unknown) => void;
};

export type RemoteLoaderProps<Query = object> = RemoteLoaderAssetsProps<Query> &
  RemoteLoaderCallbacks<Query>;
```

## 加载流程说明

内部通过一个 state 进行管理：

```ts
// 总控制状态
export enum RemoteState {
  // 预载中
  Loading = 'loading',
  // 排队中
  Pending = 'pending',
  // 已完成
  Completed = 'completed',
}

// loader/completed 状态的处理流程
export enum RemoteLoadProcess {
  // 预备中
  Prepare = 'prepare',
  // 预载中
  // 预载流程，包含了 handlePreload -> willMount ( -> onUnmount ) -> onMount
  Preload = 'preload',
  // 挂载完成
  Loaded = 'loaded',
}

// State 公共部分
export type RemoteCommonState = {
  // loader key 
  key: string;
  // 错误信息
  error?: unknown;
  // 更新时间戳，每次 state 更新都会更新这个时间戳
  timestamp: number;
  // 下载进度百分比
  percent: number;
};

// 预载状态
export type RemotePreloadState<Query = object> = RemoteCommonState & {
  // 总控状态
  state: RemoteState.Loading | RemoteState.Completed;
  // hook 调用的 props
  readonly props: RemoteLoaderAssetsProps<Query>;
  // 加载流程
  process: RemoteLoadProcess;
  // 需要预载的资产
  preloadAssets: RemoteAsset[] | null;
};

// 排队状态
export type RemotePendingState<Query = object> = RemoteCommonState & {
  state: RemoteState.Pending;
  readonly props: RemoteLoaderAssetsProps<Query>;
};

export type RemoteLoadState<Query = object> =
  | RemotePreloadState<Query>
  | RemotePendingState<Query>;
```

## 监控 RemoteLoaderAssetsProps 改变的机制

除了 `RemoteLoaderAssetsProps['key']` ，只接受一次输入。其他属性，会监控输入的
props 的变化。

一个 loader 在未完成全部挂载任务前，当 props 变化时，只会以 `propsRef` 记录新更新的值。

直到该 loader 达到 `completed` 状态，会检查此时的 `state.props` diff
`propsRef.current` 是否发生变化，如果发生变化，该 loader 将会重新开始。

`pending` 或 `completed` 的 loader，会监控实时接受 props 的变化。
