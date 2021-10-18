import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakaSectionTitleComponent } from './maka-section-title.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MakaSectionTitleComponent],
  exports: [MakaSectionTitleComponent],
  entryComponents: [MakaSectionTitleComponent]
})
export class MakaSectionTitleModule { }
