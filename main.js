// Copyright 2016 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
(() => {
  'use strict';

  const FRAME_TYPE = ['url', 'uid'];
  let current_advertisement;

  // General
  let frame_type_dropdown = document.querySelector('#frame-type');
  let url_fields = document.querySelector('#url-fields');
  let uid_fields = document.querySelector('#uid-fields');
  // Eddystone URL
  let url_prefix_dropdown = document.querySelector('#url-prefix-dropdown');
  let url_prefix = document.querySelector('#url-prefix');
  let url_field = document.querySelector('#url');
  let adv_tx_power_url = document.querySelector('#adv-tx-power-url');
  // Eddystone UID
  let namespace_field = document.querySelector('#namespace');
  let instance_field = document.querySelector('#instance');
  let adv_tx_power_uid = document.querySelector('#adv-tx-power-uid');

  let update_button = document.querySelector('#update-button');
  let stop_button = document.querySelector('#stop-button');


  frame_type_dropdown.addEventListener('change', event => {
    switch (getFrameType()) {
      case 'url':
        showURLFields();
        break;
      case 'uid':

        showUIDFields();
    }
  });

  update_button.addEventListener('click', () => {
    switch (getFrameType()) {
      case 'url':
        updateAdvertisement({
          type: getFrameType(),
          advertisedTxPower: getURLTxPower(),
          url: getURL()
        }).then(() => {
          showResult('Advertising. URL: ' + getURL() + ' ' +
                'Advertised Tx Power :' + getURLTxPower());
        }).catch(e => {
          showResult('Not advertising: ' + e.message);
        });
        break;
      case 'uid':
        updateAdvertisement({
          type: getFrameType(),
          advertisedTxPower: getUIDTxPower(),
          namespace: namespace_field.value,
          instance: instance_field.value
        }).then(() => {
          showResult('Advertising. Namespace: ' + namespace_field.value + ' ' +
                'Instance: ' + instance_field.value + ' ' +
                'Advertised Tx Power :' + getURLTxPower());
        }).catch(e => {
          showResult('Not advertising: ' + e.message);
        });
        break;
    }
  });
  stop_button.addEventListener('click', () => {
    if (current_advertisement) {
      current_advertisement.unregisterAdvertisement()
        .then(() => {
          current_advertisement = undefined;
          result_toast.duration = 3;
          showResult('Not advertising.');
        });
    }
  });

  function getFrameType() {
    if (frame_type_dropdown.selectedIndex === 0) {
      return FRAME_TYPE[0]; // URL
    } else if (frame_type_dropdown.selectedIndex === 1) {
      return FRAME_TYPE[1]; // UID
    } else {
      throw Error('Invalid Frame Type');
    }
  }
  function getURLTxPower() {
    return parseInt(adv_tx_power_url.value, 10);
  }
  function getUIDTxPower() {
    return parseInt(adv_tx_power_uid.value, 10);
  }
  function getURL() {
    let url = '';
    if (url_prefix.selectedIndex === 0 || url_prefix.selectedIndex === '0') {
      url += 'https://';
    } else if (url_prefix.selectedIndex === 1 || url_prefix.selectedIndex === '1') {
      url += 'http://';
    } else {
      throw Error('Unsupported prefix');
    }
    url += url_field.value;
    return url;
  }

  function showURLFields() {
    uid_fields.style.display = 'none';
    url_fields.style.display = 'inline-block';
  }
  function showUIDFields() {
    url_fields.style.display = 'none';
    uid_fields.style.display = 'inline-block';
  }

  function updateAdvertisement(options) {
    let promise = Promise.resolve();
    if (current_advertisement) {
      promise = promise
        .then(() => current_advertisement.unregisterAdvertisement())
        .then(() => current_advertisement = undefined);
    }
    return promise
      .then(() => eddystone.registerAdvertisement(options))
      .then(adv => current_advertisement = adv);
  }
  function showResult(message) {
    console.log("message", message)
  }
})();
