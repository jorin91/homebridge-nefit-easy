- Added `lib/nefit-client-manager.js` to own the shared Nefit Easy client, attach persistent XMPP `error` handling, store connection/auth failures, and return HomeKit callback errors instead of letting `XMPP authentication failure` crash Homebridge.
- Updated `index.js` to use the client manager for startup connection, status reads, heating-state reads, outdoor temperature reads, and target temperature writes.
- Bumped the fork version to `2.3.4` in `package.json`, `package-lock.json`, and `npm-shrinkwrap.json`.
- Pinned the original synchronous dependency set directly in `package.json`: `nefit-easy-commands@3.0.2`, `nefit-easy-core@4.0.0`, `node-xmpp-client@3.2.0`, `sasl-scram-sha-1@1.2.1`, and `saslmechanisms@0.1.1`.
- Updated `README.md` and `context/plugin-overview.md` with connection failure behavior and dependency pinning expectations.

Secondary context:
- `XMPP authentication failure` can still mean the Nefit/Bosch backend rejected credentials or the auth exchange, but it should no longer terminate the Homebridge process.
- Preserved original plugin behavior/configuration semantics while adding compatibility fixes around dependency resolution and XMPP error handling.
