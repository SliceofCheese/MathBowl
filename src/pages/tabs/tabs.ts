import { Component } from '@angular/core';

import { StartMenuPage } from '../start-menu/start-menu';
import { NavController, AlertController } from 'ionic-angular';
import {Howl, Howler} from 'howler';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StartMenuPage;
  // tab2Root = AboutPage; I don't think that 
  // tab3Root = ContactPage;
  public musicHandler: Howl;

  constructor(private alertCtrl: AlertController) {
  }

  menuReturn()
  {
    let alert = this.alertCtrl.create({
      title: 'Would you like to return back to the main menu?',
      buttons: [
        {
            text: "YES",
            role: 'BackScreen',
            handler: () => {
              console.log("this shouldn't do anything but close the log");
                
            } 
        },
        {
          text: "NO",
          role: 'BackScreen',
          handler: () => {
            this.musicHandler.stop(); 
          } 
        }
      ]
    });
    alert.present(); 
  }
}
