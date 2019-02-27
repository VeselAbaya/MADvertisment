import {formInit} from '../../components/formInit/formInit.component'
import {ApiRequest} from '../../services/apiRequest/ApiRequest.service'
import {PublishView} from './js/PublishView/PublishView'
import {IntervalField} from './js/IntervalField/IntervalField';

document.addEventListener('DOMContentLoaded', () => {
  const apiPublishRequest = new ApiRequest('publish');
  apiPublishRequest.on('success', (res) => {
    const publishView = new PublishView(res.data);

    const intervalField = new IntervalField(publishView);
    intervalField.startTimer();
  });

  apiPublishRequest.send()
});