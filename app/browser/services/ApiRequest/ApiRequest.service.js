import axios from 'axios';
import {ipcRenderer} from 'electron';
import {domain} from '../../domain';
import {EventEmitter} from 'events';

/**
 * @param apiMethod - part of url after api/__
 * @param callback - function (response)
 */
export class ApiRequest extends EventEmitter {
  constructor(apiMethod, reqBody) {
    super();

    this.url = `${domain}/api/${apiMethod}`;
    this.apiMethod = apiMethod;
    this.reqBody = reqBody;
  }

  send() {
    ipcRenderer.on('response:data', async (event, data) => {

      switch (this.apiMethod) {
      case 'prolong':
        if (data.user.userResponse) {
          axios({
            method: 'post',
            url: this.url,
            headers: {token: data.user.userResponse.token},
            data: {}
          })
            .then(res => {
              this.emit('success', res);
            })
            .catch(err => {
              this.emit('error', err);
            });
        }
        else {
          this.emit('error');
        }
        break;

      case 'types':
        axios({
          method: 'post',
          url: this.url,
          headers: {token: data.user.userResponse.token},
          data: {
            action: 'create'
          }
        })
          .then(res => {
            this.emit('success', res);
          })
          .catch(err => {
            this.emit('error', err);
          });
        break;

      case 'platforms':
        axios({
          url: this.url,
          method: 'post',
          headers: {'token': data.user.userResponse.token},
          data: {
            action: 'create',
            sessionId: data.session.id,
            sessionToken: data.session.token,
            selectedAdType: data.typeId
          }
        })
          .then(res => {
            this.emit('success', res);
          })
          .catch(err => {
            this.emit('error', err);
          });
        break;

      case 'form':
        axios({
          method: 'post',
          url: this.url,
          headers: {'token': data.user.userResponse.token},
          data: {
            action: 'create',
            sessionToken: data.session.token,
            sessionId: data.session.id,
            selectedPlatforms: data.platforms.selectedPlatforms,
            isDefaultSelect: data.platforms.isDefaultSelect
          }
        })
          .then(res => {
            this.emit('success', res);
          })
          .catch(err => {
            this.emit('error', err);
          });
        break;

      case 'submit':
        axios({
          method: 'post',
          url: this.url,
          headers: {'token': data.user.userResponse.token},
          data: {
            action: 'create',
            sessionToken: data.session.token,
            sessionId: data.session.id,
            formData: this.reqBody
          }
        })
          .then(res => {
            this.emit('success', res);
          })
          .catch(err => {
            this.emit('error', err);
          });
        break;

      case 'publish':
        axios({
          method: 'post',
          url: this.url,
          headers: {'token': data.user.userResponse.token},
          data: {
            action: 'create',
            sessionToken: data.session.token,
            sessionId: data.session.id,
          }
        })
          .then(res => {
            this.emit('success', res);
          })
          .catch(err => {
            this.emit('error', err);
          });
        break;
      }
    });

    ipcRenderer.send('request:data');
  }
}
