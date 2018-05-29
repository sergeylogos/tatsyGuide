import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceStatisticPage } from './place-statistic';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    PlaceStatisticPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceStatisticPage),
    FormsModule
  ],
})
export class PlaceStatisticPageModule {}
