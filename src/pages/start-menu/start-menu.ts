import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController} from 'ionic-angular';
import { GamePage } from '../gamePage/gamePage';

/**
 * Generated class for the StartMenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-start-menu',
  templateUrl: 'start-menu.html',
})
export class StartMenuPage {
  public musicHandler: GamePage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    
  }

startGame()
{
  // I need to add difficulty options and a flag that actually
  // determines if the game is in easy or hard

  let alert = this.alertCtrl.create({
    // title: 'Confirm purchase',
    title: 'Select your difficulty',
    enableBackdropDismiss: false,
    buttons: [
      {
        text: 'Hard',
        role: 'HardMode',
        handler: () => {
        this.navCtrl.push(GamePage,{
          isHard: true
        });

        }
      },
      {
        text: 'Normal',
        role: 'NormalMode',
        handler: () => {
        this.navCtrl.push(GamePage, {
          isHard: false
        });
        }
      }
    ]
  });
  alert.present();


}

options()
{
  this.musicHandler.musicHandler(false); 
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartMenuPage');
  }

}
