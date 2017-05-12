import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public timeLeft: number;
  public timer: number; // I need variable that can be accessed outside of gameTime(); 
  public target: number;
  public manNum: number; // this is the number that the player will be manipulating in order to win
  public operand: string;
  public victoryNum: number;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    this.gameTime();
    
  }

  // TODO: Reset all attributes
  public reset() {
    this.gameTime();
  }

  public gameTime() {
    this.timeLeft = 60;
    this.timer = setInterval(() => { // A timer that records the time a player has remaining.
      if (this.timeLeft != 0) {
        this.timeLeft -= 1;
      } else {
        clearInterval(this.timer);
        this.gameOver(this.timeLeft);
      }
    }, 1000);
    this.operand = "N";
    this.target = Math.floor(Math.random() * 200) + 1;
    this.victoryNum = Math.floor(Math.random() * 200) + 1;
  }

  accept() {
    switch (this.operand) {
      case '+':
        this.target += this.manNum;
        break;
      case '-':
        if (this.target - this.manNum < 0) {
          let alert = this.alertCtrl.create({
            title: 'Negative numbers are prohibited!',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.target -= this.manNum;
        }
        break;
      case '*':
        if (this.manNum == 0) {
          let alert = this.alertCtrl.create({
            title: 'You CANNOT DIVIDE BY ZERO!!!',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.target *= this.manNum;
        }
        break;
      case '/':
        if (this.target % this.manNum != 0) {
          let alert = this.alertCtrl.create({
            title: 'The number must be an integer',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.target /= this.manNum;
        }
        break;
      default:
        let alert = this.alertCtrl.create({
          title: 'You must select an operand',
          buttons: ['OK']
        });
        alert.present();
    }
    this.manNum = null; 
    this.operand ="N";

    if (this.target === this.victoryNum){
      clearInterval(this.timer);
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
      title: 'You win! ',
      buttons: [
        {
          text: 'Retry',
          role: 'retry',
          handler: () => {
            console.log('retry clicked');
            this.reset();
          }
        },
        {
          text: 'Quit',
          role: 'quit',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
    }
  }

  cancel() {
    this.operand = "N";
  }
  selectOp(operand: string) {
    this.operand = operand;
  }
  selectNum(number: number) {
    this.manNum = number;
    // document.getElementById().style,backgroundColor =""; 
    // Since this is easy mode, we'll have this be added for a later hard mode. 
  }

  public gameOver(timeLeft?: number) {
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
      title: 'YOU LOSE YOU ARE OUT OF TIME!',
      buttons: [
        {
          text: 'Retry',
          role: 'retry',
          handler: () => {
            console.log('retry clicked');
            this.reset();
          }
        },
        {
          text: 'Quit',
          role: 'quit',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();

  }


}
