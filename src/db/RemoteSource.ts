export type RemoteSource = {
  id: number;
  key: string;
  version: string;
  priority: number;
  /**
   * 原始 url
   */
  url: string;
  source: Uint8Array;
  updatedAt: Date;
};
