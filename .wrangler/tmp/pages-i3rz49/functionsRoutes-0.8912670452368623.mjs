import { onRequestPost as __api_analyze_ts_onRequestPost } from "/home/user/personalstylist/functions/api/analyze.ts"

export const routes = [
    {
      routePath: "/api/analyze",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_analyze_ts_onRequestPost],
    },
  ]