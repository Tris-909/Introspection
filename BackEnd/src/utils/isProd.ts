export enum DevEnvs {
  dev = "dev",
  prod = "prod",
}

export const isProd = (env: DevEnvs) => {
  return env === DevEnvs.prod;
};
