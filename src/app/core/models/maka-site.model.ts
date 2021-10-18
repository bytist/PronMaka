import {
  BaseSite,
  Country,
  Language,
  Occ
} from '@spartacus/core';
import { EnvironmentType } from './maka-globals-vars.model';

export interface MakaBaseSite extends BaseSite {
  countries: Country[];
  siteUrl?: string;
  languages: Language[];
  slug?: string; // used for hreflang
  seoUrl?: string;
  isExternal?: boolean;
  active?: boolean;
  environmentType: EnvironmentType; // development, staging, production
  openPay3DSMin?: number;
}

export interface MakaBaseSites extends Occ.BaseSites {
    baseSites?: MakaBaseSite[];
}
