export const environment = {
  production: true,
  localCacheEnabled: false,
  externalUrls: {
    openpay: 'https://js.openpay.mx/openpay.v1.min.js',
    openpayData: 'https://js.openpay.mx/openpay-data.v1.min.js',
    paypal: 'https://www.paypal.com/sdk/js?disable-funding=card,mercadopago&intent=capture&currency=MXN&locale=es_MX&client-id=',
    paypalLogo: 'https://www.paypalobjects.com/marketing/web/mx/logos-buttons/PP_100x26.png'
  },
  guestCheckoutEnabled: true,
  defaultCountry: {
    isocode: 'MX'
  },
  dashboardConfig: {
    yAxisMargin: 10
  },
  mexicanPostalCodeFormat: '^[0-9]{5}$',
  mexicanCellphoneFormat: '^[0-9]{10}$',
  rfcFormat: '^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$',
  defaultPageSize: 5
};
