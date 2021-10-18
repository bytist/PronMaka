export interface GlobalRuntimeVars {
  [key: string]: string;
}

export enum EnvironmentType {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production', // Only these 3 available in runtime
}
