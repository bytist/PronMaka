export enum PaymentProviders {
  CREDIT_CARD = 'card',
  PAYPAL = 'paypal'
}

export enum DebitCards {
  BBVA = 'bbva',
  HSBC = 'hsbc',
  INBURSA = 'inbursa',
  SCOTIABANK = 'scotiabank',
  SANTANDER = 'santander'
}

// Response from paymentmode/ GET
export interface PaymentModeActive {
  active: boolean;
  code: string;
  name: string;
  paymentProvider: string;
}

export interface PaymentMode {
  code: string;
  description?: string;
  name: string;
  paymentProvider: string;
  supports3DS?: boolean;
  payPalClientId?: string;
}

export interface PaymentModes {
  paymentModes: PaymentMode[];
}
