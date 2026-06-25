# Homebridge JSG Nefit Easy plugin

This is the active JSG-prefixed fork of the Homebridge Nefit Easy plugin. It allows controlling a Nefit Easy™ thermostat, also known as Worcester Wave™ or Junkers Control™, through HomeKit via Homebridge.

This fork uses a unique package and Homebridge plugin identifier while keeping the original accessory configuration names:

- Package name: `homebridge-jsg-nefit-easy`
- Homebridge plugin identifier: `homebridge-jsg-nefit-easy`
- Thermostat accessory config value: `NefitEasy`
- Outdoor temperature accessory config value: `NefitEasyOutdoorTemp`

The original upstream plugin is deprecated by its previous maintainer. This fork keeps the README aligned with active changes made in this repository.

Uses the [`nefit-easy-commands`](https://github.com/robertklep/nefit-easy-commands) module under the hood to communicate with the Nefit/Bosch backend.

## Installation

This library requires Node.js 6.0.0 or later and includes a Node.js 18 compatibility shim for the legacy SCRAM authentication dependency.

Install this fork from the GitHub tarball. This works on Windows machines where Git is not installed or not available on `PATH`:

```sh
npm i -g https://github.com/jorin91/homebridge-nefit-easy/archive/refs/heads/master.tar.gz
```

If Git is installed and available on `PATH`, this GitHub shorthand also works:

```sh
npm i -g github:jorin91/homebridge-nefit-easy
```

If the JSG-prefixed package is published to npm later, it can be installed with:

```sh
npm i -g homebridge-jsg-nefit-easy
```

Homebridge plugins need to be installed globally, so the `-g` flag is required for normal Homebridge usage.

Do not copy only `index.js` into an existing plugin folder. Install the package through npm so `nefit-easy-commands` and its transitive dependencies are installed as well.

## Migration from the original plugin

When moving from `homebridge-nefit-easy`, remove the original global package and install this fork:

```sh
npm uninstall -g homebridge-nefit-easy homebridge-jsg-nefit-easy
npm i -g https://github.com/jorin91/homebridge-nefit-easy/archive/refs/heads/master.tar.gz
```

Your existing accessory config values can stay the same. This fork still registers `NefitEasy` and `NefitEasyOutdoorTemp` for compatibility with existing Homebridge configuration files.

Because the config accessory names stay compatible with the original plugin, do not run the original plugin and this fork at the same time in the same Homebridge instance.

## Node.js 18 compatibility

Older versions of the SCRAM authentication dependency used by `nefit-easy-commands` can fail on Node.js 18 with this error:

```txt
ReferenceError: crypto is not defined
```

This fork initializes a small Node crypto compatibility layer before loading `nefit-easy-commands`, so the legacy dependency can still access `crypto.randomBytes` during authentication. It also ships an `npm-shrinkwrap.json` file and exact dependency pins for the original synchronous XMPP/SCRAM dependency set; newer `sasl-scram-sha-1` `1.4.x` releases return async Promise values that the old `node-xmpp-client` auth flow cannot handle.

## Connection failures

If the Nefit/Bosch backend rejects authentication, Homebridge may log XMPP authentication failure. That usually points to credentials or backend authentication, but this fork catches the underlying XMPP `error` event and reports the failure through HomeKit callbacks instead of letting the Homebridge process crash and restart.

## Problems on recent Linux distributions

If you are having problems getting any data from the HTTP server, and you are using a recent Linux distribution such as Raspbian Buster, take a look at [this comment](https://github.com/robertklep/nefit-easy-http-server/issues/35#issuecomment-510818042).

In short: OpenSSL defaults have changed to require a minimum TLS version and cipher implementation. These defaults can prevent the Nefit client code from connecting to the Nefit/Bosch backend.

The solution is mentioned [here](https://www.debian.org/releases/stable/amd64/release-notes/ch-information.en.html#openssl-defaults): edit the file `/etc/ssl/openssl.cnf` and change the following keys to these values:

```txt
MinProtocol = None
CipherString = DEFAULT
```

## Configuration

### Thermostat

First, you need a working Homebridge installation.

Once you have that working, edit `~/.homebridge/config.json` and add a new accessory:

```json
{
    "accessories": [
        {
            "accessory" : "NefitEasy",
            "name"      : "thermostaat",
            "options"   : {
                "serialNumber" : "NEFIT_SERIAL_NUMBER",
                "accessKey"    : "NEFIT_ACCESS_KEY",
                "password"     : "NEFIT_PASSWORD"
            }
        }
    ]
}
```

- The `name` is the HomeKit identifier that you can use, for example, in Siri commands.
- Replace `NEFIT_*` with the correct values.
- Any additional options get passed to the [`nefit-easy-core` constructor](https://github.com/robertklep/nefit-easy-core#constructor).

### Outdoor temperature

To also use the outdoor temperature measured by the Nefit Easy device, add a `NefitEasyOutdoorTemp` accessory to `~/.homebridge/config.json`:

```json
{
    "accessories": [
        {
            "accessory" : "NefitEasyOutdoorTemp",
            "name"      : "buitentemperatuur",
            "options"   : {
                "serialNumber" : "NEFIT_SERIAL_NUMBER",
                "accessKey"    : "NEFIT_ACCESS_KEY",
                "password"     : "NEFIT_PASSWORD"
            }
        }
    ]
}
```

All credential options should be set for both the `NefitEasy` and the `NefitEasyOutdoorTemp` device.

## Supported actions

- Getting the current temperature
- Getting the target temperature
- Setting the target temperature
- Getting the outside temperature (optional)
