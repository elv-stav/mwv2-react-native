import { z } from "zod";

export const ActivationDataModel = z.object({
  id: z.string(),
  url: z.string().url(),
  passcode: z.string(),
  expiration: z.number(),
});

export type ActivationDataModel = z.infer<typeof ActivationDataModel>