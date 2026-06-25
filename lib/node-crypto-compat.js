'use strict';

const nodeCrypto = require('crypto');

if (typeof global.crypto === 'undefined') {
  global.crypto = nodeCrypto;
}

if (typeof global.crypto.randomBytes !== 'function') {
  Object.defineProperty(global.crypto, 'randomBytes', {
    configurable: true,
    value: nodeCrypto.randomBytes.bind(nodeCrypto),
    writable: true
  });
}