import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartMenuPage } from './start-menu';

@NgModule({
  declarations: [
    StartMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(StartMenuPage),
  ],
  exports: [
    StartMenuPage
  ]
})
export class StartMenuPageModule {}
