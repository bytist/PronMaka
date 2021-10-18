import { Address } from '@spartacus/core';

export interface MakaAddress extends Address {
  petName?: string;
  streetName?: string;
  streetNumber?: string;
  appartement?: string;
  district?: string;
  reference?: string;
  cellphone?: string;
  businessName?: string;
  rfc?: string;
  legalEntityName?: string;
}
