import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { MakaMiniCartModule } from './mini-cart/maka-mini-cart.module';
import { MakaCartDetailsModule } from './cart-details/maka-cart-details.module';
import { MakaCartVoucherEffects } from '../../core/cart/store/effects/maka-cart-voucher.effect';


@NgModule({
  imports: [
    EffectsModule.forFeature([MakaCartVoucherEffects]),
    MakaMiniCartModule,
    MakaCartDetailsModule
  ],
  exports: [
    MakaMiniCartModule,
    MakaCartDetailsModule
  ]
})
export class MakaCartModule { }
