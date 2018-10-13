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
    this.NumberButtonArrayTrack[this.manNum].isDeactivated = true; 
    // Arrays for the Operand button is a bit more complicated. 
    // We need to actually find the index here, as we can't pass in the number like beforehand. 
    // We can then deactivate it if it's necessary. This may seem convoluted, and that's largely because
    // it kind of is, but considering how we stored the objects, we have to keep the actual arrays aligned so we can return the result. 
    if (this.operand != 'N'){
      let result = this.OperandButtonArrayTrack.indexOf(this.OperandButtonArrayTrack.filter(x => x.operandButtonArrayTrack == this.operand)[0]);
      this.OperandButtonArrayTrack[result].isDeactivated = true; 
    }
    
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
