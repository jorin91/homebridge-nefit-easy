- Renamed the fork package metadata from `homebridge-nefit-easy` to `homebridge-jsg-nefit-easy` and bumped the fork version to `2.3.2` in `package.json` and `package-lock.json`.
- Updated Homebridge registration in `index.js` to use plugin identifier `homebridge-jsg-nefit-easy` while keeping accessory config values compatible with the original plugin: `NefitEasy` and `NefitEasyOutdoorTemp`.
- Added `lib/node-crypto-compat.js` and load it before `nefit-easy-commands` to fix the Node.js 18 `ReferenceError: crypto is not defined` startup crash from the legacy SCRAM dependency.
- Added `config.json` to `.gitignore` so the user's personal Nefit/Homebridge config is excluded from git.
- Rewrote `README.md` as active fork documentation with GitHub install steps, original-compatible configuration examples, migration notes, and Node.js 18 compatibility notes.
- Added plugin-specific project context under `context/plugin-overview.md`.

Secondary context:
- The fork is unique through its package name and Homebridge plugin identifier, not through changed Homebridge accessory config values.
