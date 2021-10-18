import { assignIn, cloneDeep } from 'lodash';
import { OCC_USER_ID_ANONYMOUS, OCC_USER_ID_GUEST } from '@spartacus/core';
import { MakaCart, MakaRecurrenceConfiguration } from '../../../core/models/maka-cart.model';
import { RecurrenceOrderStatus } from '../../../core/models/maka-cart.model';

export const MOCK_MAKA_CART: MakaCart = {
  appliedOrderPromotions: [],
  appliedProductPromotions: [],
  appliedVouchers: [],
  code: 'D110012776',
  deliveryAddress: {
    // ToDo: looks like we have these attributes in the API response but is not expected in the MakaCart model
    //   is not part of this ticket but should be reviewed why we are not taking these
    // district: 'oij',
    // petName: '',
    // reference: '',
    // streetName: 'asdih',
    // streetNumber: 'ih',
    phone: '1231231231',
    country: { isocode: 'MX', name: 'México' },
    defaultAddress: false,
    firstName: 'DZ',
    formattedAddress: 'asdih, ih, Aguascalientes, oij, 22222',
    id: '8796752314391',
    lastName: 'Z',
    postalCode: '22222',
    region: {countryIso: 'MX', isocode: 'MX-AGU', isocodeShort: 'AGS', name: 'Aguascalientes'},
    shippingAddress: true,
    town: 'oij',
    visibleInAddressBook: true,
  },
  deliveryCost: {
    formattedValue: '$0.00 MXN'
  },
  deliveryItemsQuantity: 2,
  // entries: [,…]
  guid: 'a57a3dbf-2349-462e-950c-c6e63a4549f9',
  net: false,
  pickupItemsQuantity: 0,
  potentialOrderPromotions: [
    {
      consumedEntries: [],
      description: 'Compre 3000 o más y obtenga10% de descuento en el cart',
    }
  ],
  potentialProductPromotions: [],
  productDiscounts: {
    formattedValue: '$0.00 MXN'
  },
  recurrenceConfigurations: [{code: '2_weeks', description: '2 semanas'}, {code: '3_weeks', description: '3 semanas'}],
  subTotal: {formattedValue: '$2,670.00 MXN'},
  totalDiscounts: {formattedValue: '$0.00 MXN', value: 0},
  totalItems: 1,
  totalPrice: {currencyIso: 'MXN', formattedValue: '$2,670.00 MXN', value: 2670},
  totalPriceWithTax: { currencyIso: 'MXN', formattedValue: '$2,670.00 MXN', value: 2670 },
  totalTax: {formattedValue: '$0.00 MXN', value: 0},
  user: { name: 'Daniel', uid: 'daniel@tk.com' }
};

const MakaCartRecurrence: MakaRecurrenceConfiguration = {
  status: RecurrenceOrderStatus.ACTIVE,
  code: '2_months',
  description: '2 meses'
};

export const MOCK_MAKA_CART_WITH_RECURRENCE = assignIn(cloneDeep(MOCK_MAKA_CART), { recurrence: MakaCartRecurrence});

export const MOCK_MAKA_CART_WITH_RECURRENCE_ANONYMOUS_USER = assignIn(cloneDeep(MOCK_MAKA_CART_WITH_RECURRENCE), {
  user: { uid: OCC_USER_ID_ANONYMOUS }
});

export const MOCK_MAKA_CART_WITH_RECURRENCE_GUEST_USER = assignIn(cloneDeep(MOCK_MAKA_CART_WITH_RECURRENCE), {
  user: { name: OCC_USER_ID_GUEST }
});

export const MOCK_MAKA_CART_WITH_RECURRENCE_AND_TOTAL_HIGHER_THAN_OPENPAYMINIMUM = assignIn(cloneDeep(MOCK_MAKA_CART_WITH_RECURRENCE), {
  totalPriceWithTax: { currencyIso: 'MXN', formattedValue: '$6,100.00 MXN', value: 6100 },
});
