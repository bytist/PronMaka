import {
  CmsNavigationComponent,
  CmsComponent,
  CmsBannerComponentMedia
} from '@spartacus/core';

export interface CmsMakaFooterNavigationComponent extends CmsNavigationComponent {
  contactInfo?: string;
  helpInfo?: string;
  customLinks?: string;
  socialNetworksLinks?: string;
}

export interface CmsMakaTitleComponent extends CmsComponent {
  title?: string;
  subtitle?: string;
  image?: CmsMakaImage;
  imageAlignment?: CmsMakaImageAlignment;
}

export interface CmsMakaVideoComponent extends CmsComponent {
  url?: string;
}

export interface CmsMakaImage {
  altText?: string;
  code?: string;
  mime?: string;
  url?: string;
}

export enum CmsMakaImageAlignment {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum CMSMakaBannerAlignment {
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  BOTTOM = 'BOTTOM'
}

export interface CmsMakaBanner extends CmsComponent {
  contentAlignment: CMSMakaBannerAlignment;
  backgroundImage: CmsMakaImage;
  backgroundColor: string;
  content: string;
}
