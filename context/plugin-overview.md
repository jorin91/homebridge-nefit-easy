# homebridge-nefit-easy Context

## Identity

- Local folder: `homebridge-nefit-easy`.
- Origin remote: `https://github.com/jorin91/homebridge-nefit-easy.git`.
- Upstream remote: `https://github.com/homebridge-plugins/homebridge-nefit-easy.git`.
- Fork package name: `homebridge-jsg-nefit-easy`.
- Homebridge plugin identifier: `homebridge-jsg-nefit-easy`.
- Thermostat accessory config value: `NefitEasy`.
- Outdoor temperature accessory config value: `NefitEasyOutdoorTemp`.
- Current package version: `2.3.4`.
- Entry point: `index.js`.
- Runtime style: CommonJS Homebridge accessory plugin.

## Current Behavior

- Registers the `NefitEasy` Homebridge accessory for thermostat control under plugin identifier `homebridge-jsg-nefit-easy`.
- Registers the `NefitEasyOutdoorTemp` Homebridge accessory for the thermostat's outdoor temperature sensor under plugin identifier `homebridge-jsg-nefit-easy`.
- Loads `lib/node-crypto-compat.js` before `nefit-easy-commands` so legacy SCRAM/randombytes dependencies can access Node `crypto.randomBytes` under Node.js 18.
- Uses `lib/nefit-client-manager.js` to own the shared Nefit Easy client, attach persistent XMPP error handling, store connection failures, and return HomeKit callback errors instead of throwing process-level failures.
- Uses `nefit-easy-commands` as the client dependency for communication with the Nefit/Bosch backend.
- Accepts credentials from `config.options` or `config.authentication`.
- Required credentials are `serialNumber`, `accessKey`, and `password`.
- Reuses a module-level client manager singleton between the thermostat and outdoor temperature accessories.
- Thermostat target temperature writes are rounded to the nearest half degree before being sent to the device.
- Current heating state is derived from the backend `boiler indicator` value.
- Temperature reads retry once when the backend returns an invalid numeric value, then fall back to the last known HomeKit characteristic value where possible.

## Fork Naming Policy

- Keep the package/plugin identity JSG-prefixed so this fork remains distinct from the upstream plugin package.
- Keep the Homebridge accessory config values compatible with the original plugin: `NefitEasy` and `NefitEasyOutdoorTemp`.
- README examples must keep existing Homebridge config compatibility unless a deliberate config migration is agreed first.
- Preserve original plugin behavior and configuration semantics; this fork should only add compatibility, packaging, and crash-safety fixes unless a functional change is explicitly requested.
- Do not run the original plugin and this fork in the same Homebridge instance unless a separate compatibility strategy is implemented.

## Local Files

- Personal Homebridge/Nefit device config belongs at `.local/config.json`.
- `.local/` is ignored by git because it can contain credentials and machine-specific test data.
- Root `config.json` remains ignored as a safeguard against accidentally committing personal configuration in the old location.

## Installation Notes

- On Windows/Homebridge systems without `git.exe` on `PATH`, install from the GitHub tarball URL instead of the `github:` npm shorthand: `npm i -g https://github.com/jorin91/homebridge-nefit-easy/archive/refs/heads/master.tar.gz`.
- The `github:jorin91/homebridge-nefit-easy` npm shorthand requires Git to be installed and discoverable on `PATH`; otherwise npm fails with `spawn git ENOENT`.

## Dependency Pinning

- Keep `nefit-easy-commands`, `nefit-easy-core`, `node-xmpp-client`, `sasl-scram-sha-1`, and `saslmechanisms` pinned to the original synchronous dependency set in `package.json`.
- `sasl-scram-sha-1` must stay pinned to `1.2.1`; `1.4.x` returns Promise-based auth responses that `node-xmpp-client@3.2.0` passes into `Buffer`, causing `TypeError: The first argument must be of type string... Received an instance of Promise`.
- Keep `npm-shrinkwrap.json` in the repository so GitHub/tarball installs use the locked synchronous dependency tree instead of resolving the latest compatible semver release.

## Compatibility Notes

- Node.js 18 can surface `ReferenceError: crypto is not defined` from the old SCRAM dependency used under `nefit-easy-commands`; keep `lib/node-crypto-compat.js` loaded before that dependency.
- `XMPP authentication failure` usually means the backend rejected the credentials/auth exchange; it should be logged and returned to HomeKit callbacks, not crash Homebridge.
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