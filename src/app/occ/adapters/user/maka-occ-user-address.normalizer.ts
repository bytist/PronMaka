import { Injectable } from '@angular/core';
import {
  Converter,
  Occ
} from '@spartacus/core';
import { MakaAddress } from '../../../core/models';

@Injectable()
export class MakaOccUserAddressNormalizer implements Converter<Occ.Address, MakaAddress>
{
  convert(source: any, target?: MakaAddress): MakaAddress {

    if (target === undefined) {
      target = { ...(source) };
    }

    if (source.petName){
      target.petName = source.petName;
    }

    if (source.streetName){
      target.streetName = source.streetName;
    }

    if (source.streetNumber){
      target.streetNumber = source.streetNumber;
    }

    if (source.district){
      target.district = source.district;
    }

    if (source.cellphone){
      target.cellphone = source.cellphone;
    }

    if (source.businessName){
      target.businessName = source.businessName;
    }

    return target;
  }
}
