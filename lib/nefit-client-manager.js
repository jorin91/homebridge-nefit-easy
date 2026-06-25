'use strict';

const NefitEasyClient = require('nefit-easy-commands');

/**
 * Manages the shared Nefit Easy client connection for Homebridge accessories.
 * It keeps legacy XMPP client errors from becoming unhandled Node.js `error`
 * events, stores the latest connection failure, and lets HomeKit handlers report
 * failures through callbacks instead of crashing the Homebridge process.
 */
class NefitClientManager {
  /**
   * Creates a manager around a single Nefit Easy command client.
   *
   * @param {object} credentials Credentials and optional Nefit Easy client settings.
   * @param {object} log Homebridge logger used for connection status messages.
   */
  constructor(credentials, log) {
    this.client = NefitEasyClient(credentials);
    this.connectionError = null;
    this.connectionPromise = null;
    this.errorListener = this.recordConnectionError.bind(this);
    this.log = log;

    this.attachErrorListener();
  }

  /**
   * Starts a background connection attempt and intentionally absorbs failures.
   * HomeKit characteristic handlers will receive the stored connection error
   * through their callbacks when they try to read or write values.
   */
  start() {
    this.connect().catch(() => undefined);
  }

  /**
   * Returns thermostat status after a successful connection.
   *
   * @param {boolean} skipOutdoor Whether outdoor temperature should be skipped.
   * @returns {Promise<object>} Resolves with Nefit Easy status data.
   */
  status(skipOutdoor) {
    return this.connect().then(() => this.client.status(skipOutdoor));
  }

  /**
   * Sets the thermostat target temperature after a successful connection.
   *
   * @param {number} temperature Target temperature in Celsius.
   * @returns {Promise<void>} Resolves when the command has been accepted.
   */
  setTemperature(temperature) {
    return this.connect().then(() => this.client.setTemperature(temperature));
  }

  /**
   * Opens or reuses the active connection promise.
   *
   * @returns {Promise<object>} Resolves when the Nefit Easy client is connected.
   */
  connect() {
    if (!this.connectionPromise) {
      this.attachErrorListener();
      this.connectionPromise = this.client.connect()
        .then(result => {
          this.connectionError = null;
          this.attachErrorListener();
          return result;
        })
        .catch(error => {
          this.connectionPromise = null;
          this.recordConnectionError(error);
          throw this.connectionError;
        });
    }

    return this.connectionPromise;
  }

  /**
   * Installs a persistent XMPP error listener if the wrapped client supports it.
   */
  attachErrorListener() {
    if (!this.client || typeof this.client.on !== 'function') {
      return;
    }

    if (typeof this.client.removeListener === 'function') {
      this.client.removeListener('error', this.errorListener);
    }

    this.client.on('error', this.errorListener);
  }

  /**
   * Stores and logs a normalized connection error without throwing it.
   *
   * @param {*} error Error payload from the underlying XMPP client.
   */
  recordConnectionError(error) {
    this.connectionError = normalizeConnectionError(error);

    if (this.log && typeof this.log.error === 'function') {
      this.log.error('Nefit Easy connection failed: %s', this.connectionError.message);
    }
  }
}

/**
 * Normalizes legacy string error payloads to Error instances.
 *
 * @param {*} error Error payload emitted by the XMPP client.
 * @returns {Error} Normalized error instance.
 */
function normalizeConnectionError(error) {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error(String(error || 'Nefit Easy connection failed'));
}

module.exports = NefitClientManager;