import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { translationChunksConfig } from '@spartacus/assets';
import { HttpErrorHandler, provideDefaultConfig } from '@spartacus/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { B2cStorefrontModule, CheckoutStepType, LayoutConfig } from '@spartacus/storefront';
import { ConfigModule } from '@spartacus/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMx);

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { makaLayoutConfig } from './layout/config/layout.config';
import { MakaNavigationModule } from './cms-components/navigation/maka-navigation.module';
import { MakaMyAccountModule } from './cms-components/myaccount/maka-myaccount.module';
import { MakaUserModule } from './cms-components/user/maka-user.module';
import { MakaAddressBookModule } from './cms-components/myaccount/address-book/maka-address-book.module';
import { MakaBadRequestHandler } from './core/global-message/http-interceptors/handlers/maka-bad-request/maka-bad-request.handler';
import { MakaCartModule } from './cms-components/cart/maka-cart.module';
import { MakaHamburgerMenuModule } from './layout/header/hamburger-menu/maka-hamburger-menu.module';
import { MakaOrderConfirmationModule } from './cms-components/order-confirmation/maka-order-confirmation.module';
import { MakaOrderDetailsModule } from './cms-components/myaccount/order/order-details/maka-order-details.module';
import { MakaCheckoutPaymentModule } from './occ/adapters/maka-checkout-payment/maka-checkout-payment.module';
import { MakaModelTransformersModule } from './core/models/maka-model-transformers/maka-model-transformers.module';
import { MakaOrderHistoryModule } from './cms-components/myaccount/order/order-history/maka-order-history.module';
import { MakaAnonymousConsentManagementModule } from './cms-components/anonymous-consent-management/maka-anonymous-consent-management.module';
import { MakaMiscModule } from './cms-components/misc/maka-misc.module';
import { MakaProductModule } from './cms-components/product/maka-product.module';
import { MakaCartTotalsModule } from './cms-components/cart/cart-totals/maka-cart-totals.module';
import { MakaCheckoutModule } from './cms-components/checkout/maka-checkout.module';
import { MakaCheckoutOrderSummaryModule } from './cms-components/checkout/components/checkout-order-summary/maka-checkout-order-summary.module';
import { MakaPartnerModule } from './partners/maka-partners.module';
import { MakaPartnerAddressFormModule } from './partners/cms-components/user/address/maka-address-form.module';
import { MakaPlacingOrderModule } from './cms-components/checkout/components/placing-order/maka-placing-order.module';
import { MakaAnimationsModule } from './cms-components/animations/maka-animations.module';

import { makaOccEndpointsConfig } from './core/config/maka-occ-endpoints.config';
import { makaIconConfig } from './core/config/maka-icon.config';
import { makaPaginationConfig } from './core/config/maka-pagination-config';
import { customRoutingConfig } from './core/config/maka-routing-config';
import { makaGlobalMessageConfigFactory } from './core/global-message/global-message-config.factory';

const devImports = [];
if (!environment.production) {
  devImports.push(StoreDevtoolsModule.instrument());
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    B2cStorefrontModule.withConfig({
      backend: {
        occ: {
          prefix: '/rest/v2/',
          endpoints: makaOccEndpointsConfig,
          useWithCredentials: true
        }
      },
      context: {
        baseSite: ['maka-store', 'maka-partners'],
        currency: ['MXN'],
        language: ['es_MX'],
        urlParameters: ['baseSite']
      },
      i18n: {
        backend: {
          loadPath: 'assets/i18n-assets/{{lng}}/{{ns}}.json'
        },
        chunks: translationChunksConfig,
        fallbackLang: 'en'
      },
      checkout: {
        guest: environment.guestCheckoutEnabled,
        steps: [
          {
            id: 'shippingAddress',
            name: 'checkoutProgress.shippingAddress',
            routeName: 'checkoutShippingAddress',
            type: [
              CheckoutStepType.SHIPPING_ADDRESS,
              CheckoutStepType.DELIVERY_MODE
            ],
          },
          {
            id: 'paymentDetails',
            name: 'checkoutProgress.paymentDetails',
            routeName: 'checkoutPaymentDetails',
            type: [CheckoutStepType.PAYMENT_DETAILS],
          },
          {
            id: 'reviewOrder',
            name: 'checkoutProgress.reviewOrder',
            routeName: 'checkoutReviewOrder',
            type: [CheckoutStepType.REVIEW_ORDER],
          },
        ],
      },
      features: {
        level: '2.0'
      }
    }),
    BrowserTransferStateModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ConfigModule.withConfig(makaLayoutConfig as LayoutConfig),
    ConfigModule.withConfig(customRoutingConfig),
    ConfigModule.withConfigFactory(makaGlobalMessageConfigFactory),
    // Maka Modules
    MakaUserModule,
    MakaCartModule,
    MakaNavigationModule,
    MakaProductModule,
    MakaMyAccountModule,
    MakaAddressBookModule,
    MakaHamburgerMenuModule,
    MakaOrderDetailsModule,
    MakaOrderConfirmationModule,
    MakaCheckoutPaymentModule,
    MakaOrderHistoryModule,
    MakaModelTransformersModule,
    MakaAnonymousConsentManagementModule,
    MakaMiscModule,
    MakaCartTotalsModule,
    MakaCheckoutModule,
    MakaPartnerModule,
    MakaCheckoutOrderSummaryModule,
    MakaPartnerAddressFormModule,
    MakaPlacingOrderModule,
    MakaAnimationsModule,
    ...devImports
  ],
  providers: [
    provideDefaultConfig(makaIconConfig),
    provideDefaultConfig(makaPaginationConfig),
    {
      provide: HttpErrorHandler,
      useExisting: MakaBadRequestHandler,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
