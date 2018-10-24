import { Component } from '@angular/core';
import { NavController, AlertController , NavParams} from 'ionic-angular';
import {Howl} from 'howler';
// import { ButtonActivation } from '/src/enums';

@Component({
  selector: 'page-gamePage',
  templateUrl: 'gamePage.html'
})

// enum ButtonActivation{
//   Activated = true,
//   Deactivated = false
// }

export class GamePage {

  public timeLeft: number;
  public timer: number; // I need variable that can be accessed outside of gameTime(); 
  public target: number;
  public manNum: number; // this is the number that the player will be manipulating in order to win
  public operand: string;
  public victoryNum: number;
  public oscillator: any;
  public currentMusic: Howl;
  public sound: Howl; 
  public isHard: boolean;
  public isPaused: boolean = false; 
  public buttonDisabled: boolean = false; 
  public NumberButtonArrayTrack: any;
  public OperandButtonArrayTrack: any;


  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams) {
    this.gameTime();
    this.musicHandler();
    this.soundHandler(); 
    // this.isHard = navParams.get('isHard');
    this.buttonArray(); 
  }

  // TODO: Reset all attributes
  public reset() {
    this.gameTime();
    this.musicHandler();
    this.buttonArray(); 
    this.isPaused = false; 
  }

  public buttonArray(){
    let NumberButtonUsage : { buttonNumber: number, isDeactivated: boolean }[] = [
      {"buttonNumber": 0, "isDeactivated": false },
      {"buttonNumber": 1, "isDeactivated": false },
      {"buttonNumber": 2, "isDeactivated": false },
      {"buttonNumber": 3, "isDeactivated": false },
      {"buttonNumber": 4, "isDeactivated": false },
      {"buttonNumber": 5, "isDeactivated": false },
      {"buttonNumber": 6, "isDeactivated": false },
      {"buttonNumber": 7, "isDeactivated": false },
      {"buttonNumber": 8, "isDeactivated": false },
      {"buttonNumber": 9, "isDeactivated": false },
    ];

    let OperandButtonUsage : { operandButtonArrayTrack: string, isDeactivated: boolean }[] = [
      {"operandButtonArrayTrack": '+', "isDeactivated": false },
      {"operandButtonArrayTrack": '-', "isDeactivated": false },
      {"operandButtonArrayTrack": '*', "isDeactivated": false },
      {"operandButtonArrayTrack": '/', "isDeactivated": false },
    ];

    this.NumberButtonArrayTrack = NumberButtonUsage; 
    this.OperandButtonArrayTrack = OperandButtonUsage; 
    this.manNum = null;
  }

  public soundHandler(){
    this.sound = new Howl({
      src: ['assets/sound/Sounds.ogg'],
      sprite:{
        beep:[0,500],
        accept:[1000,1500],
        back:[2000,2500],
        countdown:[3000,3500],
        startgame:[4000,4500],
      }
    });
  }


  public musicHandler(status = true) {
    var audio = new Audio('../MathBowl/src/assets/music/NumbersMusic1.ogg');
    audio.play();
    this.currentMusic = new Howl({
      src: ['assets/music/NumbersMusic1.ogg'],
      loop: true
    });
  //  this.currentMusic.play();

   if (status == false)
      this.currentMusic.stop(); 
  }

  public runOscillator() {
    var audioContext = new AudioContext();
    this.oscillator = audioContext.createOscillator();
    // Connect the oscillator to our speakers all of this is requierd.S
    this.oscillator.connect(audioContext.destination);
    this.oscillator.start(audioContext.currentTime);
    // Stop the oscillator 3 seconds from now
    this.oscillator.stop(audioContext.currentTime + 1);
  }
  public gameTime() {
    this.timeLeft = 60;
    this.timer = setInterval(() => { // A timer that records the time a player has remaining.
      if (this.isPaused == true)
      {
        this.timeLeft = this.timeLeft;
      }
      else if (this.timeLeft != 0 && this.isPaused == false)  {
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
    let stopAccept : boolean = false; 
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
        if (this.manNum == 0 || this.manNum === undefined || this.manNum === null) {
          let alert = this.alertCtrl.create({
            title: 'You CANNOT MULTIPLY BY ZERO!!!',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.target *= this.manNum;
        }
        break;
      case '/':
        if (this.target % this.manNum != 0 && this.manNum != 0) {
          let alert = this.alertCtrl.create({
            title: 'The number must be an integer',
            buttons: ['OK']
          });
          alert.present();
        }
        else if (this.manNum == 0) {
          let alert = this.alertCtrl.create({
            title: 'You CANNOT MULTIPLY BY ZERO!!!',
            buttons: ['OK']
          });
          alert.present();
          stopAccept = true; 
        }
        else 
        {
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
    // reset the numbers to default. 
    // as well as disable the used button. 
    // Arrays for the Operand button is a bit more complicated. 
    // We need to actually find the index here, as we can't pass in the number like beforehand. 
    // We can then deactivate it if it's necessary. This may seem convoluted, and that's largely because
    // it kind of is, but considering how we stored the objects, we have to keep the actual arrays aligned so we can return the result. 
    if (this.operand != 'N' && (this.manNum != null || this.manNum != undefined) && stopAccept == false){
      let result = this.OperandButtonArrayTrack.indexOf(this.OperandButtonArrayTrack.filter(x => x.operandButtonArrayTrack == this.operand)[0]);
      this.OperandButtonArrayTrack[result].isDeactivated = true; 
      this.NumberButtonArrayTrack[this.manNum].isDeactivated = true; 
    }

    // We need to actually have a check that ensures that we are able to reset all of the numbers back. 
    // We may need to check to see what all of the variables are based on some sort of manipulation of the bits themselves? 
    // Not entirely sure here, but I'm just going to experiement and try something for a check on all of these. 


    // let filtereNumberButtonArray
    
    this.manNum = null;
    this.operand = "N";

    if (this.target === this.victoryNum) {
      clearInterval(this.timer);
      this.currentMusic.stop();      
      let alert = this.alertCtrl.create({
        // title: 'Confirm purchase',
        title: 'You win! ',
        enableBackdropDismiss: false,
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
              console.log('Bye clicked');
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    }
  }

  cancel() {
    this.operand = "N";
    this.manNum = null; 
  }
  selectOp(operand: string) {
    this.operand = operand;
  }
  selectNum(number: number) {
    this.manNum = number;
    this.sound.play('beep');
    // document.getElementById().style,backgroundColor =""; 
    // Since this is easy mode, we'll have this be added for a later hard mode. 
    // TODO: Add a graying out in the event that you successfully select a number and operator combination.
    switch(this.manNum)
    {
      case 1: 
      break; 
      case 2:
      break; 
       
      case 3: 
      break; 

      case 4: 
      break; 

      case 5: 
      break; 

      case 6: 
      break; 

      case 7: 
      break; 

      case 8: 
      break; 

      case 9: 
      break; 

      case 0: 
      break; 

    }

  }

  public pause(){
    this.isPaused = true; 
    let alert = this.alertCtrl.create({
      title: 'PAUSED',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Resume',
          role: 'Resume',
          handler: () => {
            this.isPaused = false; 
          }
        },
        {
          text: 'Quit',
          role: 'quit',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();

  }

  public gameOver(timeLeft?: number) {
    this.runOscillator();
    this.currentMusic.stop();
    let alert = this.alertCtrl.create({
      title: 'YOU LOSE YOU ARE OUT OF TIME!',
      enableBackdropDismiss: false,
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
