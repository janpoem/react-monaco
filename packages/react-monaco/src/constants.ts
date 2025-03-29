export const MonacoWorkerLabels = {
  editor: [],
  ts: ['typescript', 'javascript'],
  html: ['html', 'handlebars', 'razor'],
  json: ['json'],
  css: ['css', 'scss', 'less'],
} as const;

export enum MonacoLoaderProcess {
  Initializing = 'Initializing',
  Loading = 'Loading',
  Preparing = 'Preparing',
  Completed = 'Completed',
}

export enum MonacoReadyState {
  Prepare = 0,
  Mounting = 1,
  Mounted = 2,
}
