import { Injectable } from '@angular/core';
import {
  Converter,
  Occ
} from '@spartacus/core';
import { MakaUser } from '../../../../core/models/maka-user.model';

@Injectable()
export class MakaOccUserNormalizer implements Converter<Occ.User, MakaUser>
{
  convert(source: any, target?: MakaUser): MakaUser {

    if (target === undefined) {
      target = { ...(source) };
    }

    if (source.associateId){
      target.associateId = source.associateId;
    }

    return target;
  }
}
