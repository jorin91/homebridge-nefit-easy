# homebridge-nefit-easy Context

## Identity

- Local folder: `homebridge-nefit-easy`.
- Origin remote: `https://github.com/jorin91/homebridge-nefit-easy.git`.
- Upstream remote: `https://github.com/homebridge-plugins/homebridge-nefit-easy.git`.
- Fork package name: `homebridge-jsg-nefit-easy`.
- Homebridge plugin identifier: `homebridge-jsg-nefit-easy`.
- Thermostat accessory config value: `NefitEasy`.
- Outdoor temperature accessory config value: `NefitEasyOutdoorTemp`.
- Current package version: `2.3.2`.
- Entry point: `index.js`.
- Runtime style: CommonJS Homebridge accessory plugin.

## Current Behavior

- Registers the `NefitEasy` Homebridge accessory for thermostat control under plugin identifier `homebridge-jsg-nefit-easy`.
- Registers the `NefitEasyOutdoorTemp` Homebridge accessory for the thermostat's outdoor temperature sensor under plugin identifier `homebridge-jsg-nefit-easy`.
- Loads `lib/node-crypto-compat.js` before `nefit-easy-commands` so legacy SCRAM/randombytes dependencies can access Node `crypto.randomBytes` under Node.js 18.
- Uses `nefit-easy-commands` as the client dependency for communication with the Nefit/Bosch backend.
- Accepts credentials from `config.options` or `config.authentication`.
- Required credentials are `serialNumber`, `accessKey`, and `password`.
- Reuses a module-level `deviceClient` singleton between the thermostat and outdoor temperature accessories.
- Thermostat target temperature writes are rounded to the nearest half degree before being sent to the device.
- Current heating state is derived from the backend `boiler indicator` value.
- Temperature reads retry once when the backend returns an invalid numeric value, then fall back to the last known HomeKit characteristic value where possible.

## Fork Naming Policy

- Keep the package/plugin identity JSG-prefixed so this fork remains distinct from the upstream plugin package.
- Keep the Homebridge accessory config values compatible with the original plugin: `NefitEasy` and `NefitEasyOutdoorTemp`.
- README examples must keep existing Homebridge config compatibility unless a deliberate config migration is agreed first.
- Do not run the original plugin and this fork in the same Homebridge instance unless a separate compatibility strategy is implemented.

## Local Files

- `config.json` is ignored by git because it is a personal Homebridge/Nefit device configuration file that may contain credentials.

## Compatibility Notes

- Node.js 18 can surface `ReferenceError: crypto is not defined` from the old SCRAM dependency used under `nefit-easy-commands`; keep `lib/node-crypto-compat.js` loaded before that dependency.
- If Homebridge logs `Cannot find module 'nefit-easy-commands'`, the plugin was not installed with its dependencies; reinstall through npm/GitHub rather than copying individual files.
- Homebridge config can continue to use `NefitEasy` and `NefitEasyOutdoorTemp` after moving to this fork.

## Constraints

- The upstream README marks the original plugin as deprecated, so future work should verify behavior against an actual current Homebridge and Nefit Easy setup when possible.
- `package.json` declares support for Node.js `>=6.0.0` and Homebridge `>=0.2.0`; keep compatibility expectations explicit when modernizing.
- The current implementation is concentrated in `index.js`; if new behavior is added, split responsibilities into focused files instead of growing a catch-all script.
- Shared Homebridge workspace conventions belong in the root `../context/` folder. Only plugin-specific context belongs here.

## Workflow Notes

- Treat `origin` as the user's fork.
- Treat `upstream` as the original plugin source.
- Keep `context/github-update-summary.md` ready with concise, not-yet-pushed changes whenever this plugin repository is modified.
- Keep `README.md` actively updated with functional, configuration, installation, or naming changes.
