import { z } from "zod";

export const NftInfoModel = z.object({
  contract: z.string(),
  cap: z.number(),
  minted: z.number(),
  total_supply: z.number(),
  burned: z.number(),
});

export type NftInfoModel = z.infer<typeof NftInfoModel>
