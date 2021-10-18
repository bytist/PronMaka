export const makaOccEndpointsConfig: any = {
    carts: 'users/${userId}/carts?fields=carts(DEFAULT,potentialProductPromotions,appliedProductPromotions,' +
    'potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),' +
    'stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,' +
    'totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),' +
    'deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue, value),pickupItemsQuantity,net,' +
    'appliedVouchers,productDiscounts(formattedValue),saveTime,user,name,recurrence(FULL),recurrenceConfigurations(FULL)' +
    'paymentAddress(FULL),deliveryAddress(FULL))',
    cart: 'users/${userId}/carts/${cartId}?fields=DEFAULT,potentialProductPromotions,appliedProductPromotions,' +
    'potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),' +
    'stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,' +
    'totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),' +
    'deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue, value),pickupItemsQuantity,net,' +
    'appliedVouchers,productDiscounts(formattedValue),user,recurrence(FULL),recurrenceConfigurations(FULL),' +
    'paymentAddress(FULL),deliveryAddress(FULL),paymentInfo(FULL)',
    paymentModes: 'paymentmodes', // public endpoint
    paymentMode: 'users/${userId}/carts/${cartId}/paymentmode', // cart endpoint
    paypalCreate: 'users/${userId}/carts/${cartId}/payment/paypal/order/create',
    paypalCapture: 'users/${userId}/carts/${cartId}/payment/paypal/order/capture',
    uploadCfdi: 'associates/${userId}/commissions/charge',
    cancelRecurrentOrder: 'users/${userId}/recurring/orders/${orderId}/cancel',
};
