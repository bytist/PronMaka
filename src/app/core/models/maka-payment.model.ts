export enum PaymentProviders {
    PAYPAL = 'PAYPAL',
    OPENPAY = 'OPENPAY',
    MOCKUP = 'MOCKUP' // used for performance testing
}

// Response from paymentmode/ paymentmodes/ GET
export interface PaymentMode {
  active?: boolean;
  code: string;
  name: string;
  paymentProvider?: string;
  paypalClientId?: string;
}

