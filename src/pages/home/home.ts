import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {Howl, Howler} from 'howler';

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
  public oscillator: any;
  public currentMusic: Howl;
  public sound: Howl; 

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    this.gameTime();
    this.musicHandler();
    this.soundHandler(); 

  }

  // TODO: Reset all attributes
  public reset() {
    this.gameTime();
    this.musicHandler();
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
    // var audio = new Audio('../MathBowl/src/assets/music/NumbersMusic1.ogg');
    // audio.play();
    this.currentMusic = new Howl({
      src: ['assets/music/NumbersMusic1.ogg'],
      loop: true
    });
   this.currentMusic.play();
    /*
    This isn't a bad idea, however, it's a request that must be made to a URL. You cannot reference a local file
    it's cross domain only-- which means that it must be transferred between two_ differeing secruity domains.
    */
    // var request = new XMLHttpRequest();
    // var audioContext = new AudioContext();

    // request.open('GET', 'Users/Sean/MathBowl/src/assets/music/NumbersMusic1.ogg', true);
    // request.responseType = 'arraybuffer';

    // request.onload = function () {
    //   var undecodedAudio = request.response;

    //   audioContext.decodeAudioData(undecodedAudio, function (buffer) {
    //     var sourceBuffer = audioContext.createBufferSource();

    //     sourceBuffer.buffer = buffer;
    //     sourceBuffer.connect(audioContext.destination);
    //     sourceBuffer.start(audioContext.currentTime);
    //   });
    // };

    // request.send();

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
    this.sound.play('beep');
    // document.getElementById().style,backgroundColor =""; 
    // Since this is easy mode, we'll have this be added for a later hard mode. 
    // TODO: Add a graying out in the event that you successfully select a number and operator combination.
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
