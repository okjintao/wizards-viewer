import { CollectionInfo } from './collection-info.interface';

export interface OpenseaResponse {
  data: {
    collection: CollectionInfo;
  };
}
