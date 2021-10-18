import {
  Component,
  OnInit
} from '@angular/core';
import {
  AddressBookComponent,
  AddressBookComponentService
} from '@spartacus/storefront';
import {
  CheckoutDeliveryService,
  TranslationService,
  UserAddressService
} from '@spartacus/core';
import {combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { MakaAddress } from '../../../core/models';

const WHITESPACE_SEPARATOR = ' ';
const COMMA_SEPARATOR = ', ';
const DASH_SEPARATOR = ' - ';

@Component({
  selector: 'app-maka-address-book',
  templateUrl: './maka-address-book.component.html'
})
export class MakaAddressBookComponent extends AddressBookComponent implements OnInit {

  constructor(
    service: AddressBookComponentService,
    translation: TranslationService,
    userAddressService: UserAddressService,
    checkoutDeliveryService: CheckoutDeliveryService
  )
  {
    super(service, translation, userAddressService, checkoutDeliveryService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  getMakaCardContent(address: MakaAddress){
    return combineLatest([
      this.translation.translate('addressCard.default'),
      this.translation.translate('addressCard.setAsDefault'),
      this.translation.translate('common.delete'),
      this.translation.translate('common.edit'),
      this.translation.translate('addressBook.areYouSureToDeleteAddress'),
    ]).pipe(
      map(
        ([
           defaultText,
           setAsDefaultText,
           textDelete,
           textEdit,
           textVerifyDeleteMsg,
         ]) => {
          let region = '';

          if (address.region) {
            if (address.region.name) {
              region = address.region.name + COMMA_SEPARATOR;
            } else {
              region = address.region.isocode + COMMA_SEPARATOR;
            }
          }

          let line1 = address.streetName + WHITESPACE_SEPARATOR + address.streetNumber;

          if (address.appartement) {
            line1 = line1 + DASH_SEPARATOR + address.appartement;
          }

          const actions: { name: string; event: string }[] = [];

          if (!address.defaultAddress) {
            actions.push({ name: setAsDefaultText, event: 'default' });
          }

          actions.push({ name: textEdit, event: 'edit' });
          actions.push({ name: textDelete, event: 'delete' });

          return {
            textBold: address.firstName + WHITESPACE_SEPARATOR + address.lastName,
            text: [
              line1,
              address.district,
              address.town + COMMA_SEPARATOR + region + address.country.isocode,
              address.postalCode,
              address.cellphone,
              address.petName
            ],
            actions,
            header: address.defaultAddress ? `${defaultText}` : '',
            deleteMsg: textVerifyDeleteMsg,
          };
        }
      )
    );
  }
}
