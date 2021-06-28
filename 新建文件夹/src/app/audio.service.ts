import { Injectable } from '@angular/core';
import { DlogService } from './dlog.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audioEl: HTMLAudioElement;
  public playData: any;

  private endedCallback: any;

  constructor(
    public dlogService: DlogService
  ) {
    this.audioEl = document.createElement('audio');
    this.audioEl.autoplay = false;
    this.audioEl.onplay = () => {

    };
    this.audioEl.onended = () => {
      this.pause();
      if (this.endedCallback) {
        this.endedCallback(this.playData);
      }
    };
    this.audioEl.onabort = () => {};
    this.audioEl.onpause = () => {
      this.pause();
    };
    this.audioEl.ondurationchange = () => {

    };
  }

  public toggle(ring?: any, $event?: any): void {
    if (this.playData === ring && this.playData.playing) {
      this.pause();
    } else {
      this.pause();
      this.playData = ring;
      this.playData.playing = true;
      this.audioEl.src = this.playData.mp3;
      this.audioEl.play();
      this.playData.currentTimer = setInterval(() => {
        this.playData.currentTime = this.audioEl.currentTime;
      }, 1000 / 60);
    }
  }

  public pause(): void {
    if (this.playData) {
      this.playData.playing = false;
      clearInterval(this.playData.currentTimer);
      this.playData.currentTime = 0;
      this.audioEl.pause();
    }
  }

  public setEndedCallback(eback: any) {
    this.endedCallback = eback;
  }
}
