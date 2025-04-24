import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";

export type RootStackParamList = {
  Discover: undefined,
  PropertyDetail: { property: MediaPropertyModel };
}
