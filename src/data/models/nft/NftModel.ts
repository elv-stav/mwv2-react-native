import { z } from "zod";
import { nullToUndefined } from "@/data/models/zod-extensions";

export const NftModel = z.object({
  contract_addr: z.string().nullish().transform(nullToUndefined),
  token_id: z.number().nullish().transform(nullToUndefined),
  meta: z.object({
    display_name: z.string().nullish().transform(nullToUndefined),
    image: z.string().nullish().transform(nullToUndefined),
  }),
  nft_template: z.object({
    display_name: z.string().nullish().transform(nullToUndefined),
    edition_name: z.string().nullish().transform(nullToUndefined),
  }).nullish().transform(nullToUndefined),
}).transform(obj => ({
  ...obj,
  _uid: `${obj.contract_addr}_${obj.token_id}`,
  _name: obj.meta?.display_name || obj.nft_template?.display_name || "",
}));

export type NftModel = z.infer<typeof NftModel>
