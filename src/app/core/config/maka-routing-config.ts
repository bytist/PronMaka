import { RoutingConfig } from '@spartacus/core';

export const customRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      commissionDetails: {
        paths: ['commissions/detail/:code']
      }
    }
  },
};

