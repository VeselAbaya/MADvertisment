import {EventEmitter} from 'events'
import {ipcRenderer} from 'electron'
import {StagesBar} from '../StagesBar/StagesBar'
import {WebviewWrapper} from '../../script-tools/renderer.js';

export class PublishView extends EventEmitter {
  public stagesBar: StagesBar;
  public webview: any;
  private webviewWrapper: WebviewWrapper;
  private onPause: boolean = false;

  constructor(options) {
    super();

    this.stagesBar = new StagesBar(options);
    this.webview = document.querySelector('webview');
    this.webviewWrapper = new WebviewWrapper(this.webview, ipcRenderer, './script-tools/preload.js');
    this.webview.src = this.stagesBar.currentURL;

    // to avoid multiple timers
    this.on('url-start-loading', () => {
      this.webview.addEventListener('did-finish-load', () => {
        this.emit('loaded');
      }, {once: true});
    });

    // this.emit('url-start-loading');
  }

  play() {
    const button = document.querySelector('#publish__screen-play-pause');
    button.innerHTML = "Пауза";

    this.onPause = false;

    const allStagesLength = this.currentStagesLength;
    const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages;
    let stage = stages[this.stagesBar.currentStageIndex - (allStagesLength - stages.length) - 1];
    if(stage !== undefined && stage.breakpoint === true) {
      this.stagesBar.removeBreakpointFor(stage);
    }

    this.nextStage();
  }

  pause() {
    const button = document.querySelector('#publish__screen-play-pause');
    button.innerHTML = "Продолжить";

    this.onPause = true;
  }

  get currentStagesLength() {
    let stagesLength = 0;
    for(let i = 0; i <= this.stagesBar.currentURLIndex; i++) {
      const stages = this.stagesBar.data[i].stages;
      stagesLength += stages.length;
    }

    return stagesLength;
  }

  isLastStage() {
    return this.stagesBar.currentStageIndex >= this.currentStagesLength - 1;
  }

  nextStage() {
    const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages;
    const allStagesLength = this.currentStagesLength;
    const stage = stages[this.stagesBar.currentStageIndex - (allStagesLength - stages.length)];

    if(this.onPause) {
      return false;
    }

    if (this.stagesBar.currentStageIndex < allStagesLength) {
      const actions = stages[this.stagesBar.currentStageIndex - (allStagesLength - stages.length)].actions;
      this.webviewWrapper.performActions(actions);

      let result = this.stagesBar.nextStage();
      if(stage !== undefined && stage.breakpoint === true) {
        this.pause();
      }

      return result;
    }
    else {
      if(stage !== undefined && stage.breakpoint === true) {
        this.pause();
      }

      return false;
    }
  }

  nextURL() {
    this.stagesBar.nextURL();

    this.webview.loadURL(this.stagesBar.currentURL); // in webviewWrapper changes too
    this.emit('url-start-loading');
  }
}