import { z } from "zod";

export const FabricConfigModel = z.object({
  node_id: z.string(),
  network: z.object({
    services: z.object({
      authority_service: z.array(z.string()),
      ethereum_api: z.array(z.string()),
      fabric_api: z.array(z.string()),
    })
  }),
  qspace: z.object({
    id: z.string(),
    names: z.array(z.string())
  }),
}).transform(obj => ({
  ...obj,
  authdBaseUrl: obj.network.services.authority_service[0],
  fabricBaseUrl: `${obj.network.services.fabric_api[0]}/s/${obj.qspace.names[0]}`,
}));

export type FabricConfigModel = z.infer<typeof FabricConfigModel>;
