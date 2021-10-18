import { Image } from '@spartacus/core';

export enum MakaVariantType {
  SIZE = 'ApparelSizeVariantProduct',
  STYLE = 'ApparelStyleVariantProduct',
  COLOR = 'ElectronicsColorVariantProduct',
  WEIGHT = 'MakaWeightVariantProduct'
}

export enum MakaVariantQualifier {
  SIZE = 'size',
  STYLE = 'style',
  COLOR = 'color',
  THUMBNAIL = 'thumbnail',
  PRODUCT = 'product',
  ROLLUP_PROPERTY = 'rollupProperty',
  WEIGHT = 'weight'
}

export interface MakaVariantOptionQualifier {
  image?: Image;
  name?: string;
  qualifier?: MakaVariantQualifier;
  value?: string;
}
