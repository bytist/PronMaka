export interface PaypalCreateResponse {
  payPalOrderId: string;
  payPalOrderStatus: PaypalOrderStatus;
}

export interface PaypalAuthorizeResponse {
  payPalOrderId: string;
  payPalOrderStatus: PaypalOrderStatus;
}

export enum PaypalOrderStatus {
  COMPLETED = 'COMPLETED',
  CREATED = 'CREATED'
}
