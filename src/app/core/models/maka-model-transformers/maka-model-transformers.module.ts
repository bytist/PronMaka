import { NgModule } from '@angular/core';

import { GetPetNameFromOrderPipe } from './GetPetNameFromOrder.pipe';

@NgModule({
  declarations: [GetPetNameFromOrderPipe],
  exports: [GetPetNameFromOrderPipe]
})
export class MakaModelTransformersModule { }
