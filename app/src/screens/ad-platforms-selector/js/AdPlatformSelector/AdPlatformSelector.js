import {ipcRenderer} from 'electron'
import {genHTML} from './genHTML'
import {updateModalHTML} from './updateModalHTML'
import {AccountDataAlert} from '../AccountDataAlert/AccountDataAlert';

export class AdPlatformSelector {
  constructor(options) {
    this.platformsData = options.platformsData;               // Array
    this.platformsAuth = options.platformsAuth;               // Array
    this.standardPlatformsIds = options.standardPlatformsIds; // Array
    this.showCheckboxes = options.showCheckboxes;             // boolean
    this.showStatuses = options.showStatuses;                 // boolean
    this.canChangeData = options.canChangeData;               // boolean
    this.container = options.container;                       // DOMElement
    this.modal = new AccountDataAlert(this);
    this.currentOpenedId = null;                              // Number

    options.container.querySelector('.ad-selector__platforms').insertAdjacentHTML('beforeend', genHTML(options));

    this.container.querySelectorAll('.ad-selector__platform-button--settings').forEach(button => {
      button.addEventListener('click', () => {
        const platformId = parseInt(button.dataset['id']);
        this.blinkSettings(platformId);

        setTimeout(() => {
          this.modalOpen(platformId)
        }, 1000)
      })
    });

    const startButton = this.container.querySelector('.ad-selector__submit');
    if (this.selectedPlatformsIds.length) {
      startButton.disabled = false;
    }

    const checkboxes = this.container.querySelectorAll('.form-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('input', () => {
        startButton.disabled = !Array.from(checkboxes).some(checkbox => checkbox.checked)
      })
    });

    const rememberCheckbox = this.container.querySelector('.ad-selector__remember-checkbox');
    this.container.querySelector('.ad-selector__form').addEventListener('submit', () => {
      event.preventDefault();
      const selectedPlatformsIds = this.selectedPlatformsIds;

      let allAccountDataFilled = true;
      selectedPlatformsIds.forEach(id => {
        const auth = this.platformsAuth.find(auth => auth.id === id);
        const authDataValuesArray = Object.values(auth.authData);
        if (authDataValuesArray.length === 0 ||
          authDataValuesArray.some(value => value === '')) {
          allAccountDataFilled = false;
          this.blinkSettings(id)
        }
      });

      if (allAccountDataFilled) {
        ipcRenderer.send('adPlatformsSelector:submit', {
          selectedPlatforms: selectedPlatformsIds,
          isStandardChoice: rememberCheckbox.checked
        })
      }
    });

    // error if all platforms are not active
    if (this.platformsData.every(platform => !platform.active)) {
      throw new Error('All platforms are not active')
    }
  }

  get selectedPlatformsIds() {
    const checkboxes = this.container.querySelectorAll('.form-checkbox');
    return Array.from(checkboxes)
      .filter(el => el.checked === true)
      .map(el => parseInt(el.id))
  }

  modalOpen(id) {
    if (!this.modal.opened) {
      this.currentOpenedId = id;

      updateModalHTML(this, id);
      this.modal.open()

      // TODO when I will have account data
      // const loginField = this.modal.container.querySelector('#login')
      // const passwordField = this.modal.container.querySelector('#password')
      //
      // const authData = this.platformsAuth.find(el => el.id === this.currentOpenedId)
      // if (authData) {
      //     loginField.value = authData.login
      //     passwordField.value = authData.password
      // }
      //
      // if (loginField.value && passwordField.value) {
      //     this.modal.container.querySelectorAll('.form-label').forEach(label => {
      //         // TODO fix that SHIT!!!
      //         focusLabel(label)
      //     })
      // }
    }
  }

  modalClose() {
    // this.modal.container.querySelector('#login').value = ''
    // this.modal.container.querySelector('#password').value = ''
    // this.modal.container.querySelectorAll('.form-label').forEach(label => {
    // TODO fix that SHIT!!!
    // blurLabel(label)
    // })
  }

  blinkSettings(id) {
    const icon = this.container.querySelector(`button[data-id="${id}"] span`);
    icon.style.backgroundColor = '#b5051a';

    setTimeout(() => {
      icon.style.backgroundColor = '#000000'
    }, 500)
  }
}
