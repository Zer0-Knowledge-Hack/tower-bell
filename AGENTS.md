# Towerbell Project Guidelines

Welcome to the Towerbell repository. If you are an AI assistant or agent working on this codebase, you MUST adhere to the following rules, context, and architectural decisions.

## Project Context

- **Description**: Towerbell is a Hyperlocal P2P Discovery tool built on the Holepunch/Pear stack. It enables businesses (beacons) and travelers (scanners) to discover each other without internet, servers, or accounts.
- **Language & Runtime**: Node.js / Javascript. Built specifically for the `bare` runtime (Pear's native runtime).
- **Package Manager**: pnpm. Do NOT use `npm` or `yarn`.
- **Dependencies config**: The project uses `.npmrc` with `node-linker=hoisted` because `pear` tooling relies on a hoisted `node_modules` structure.

## Architectural Rules

1. **Separation of Concerns**:
   - The UI/Frontend must NEVER contain P2P logic.
   - The `backend/` folder exposes a clean contract (`scan()` and `beacon()`). The UI interacts exclusively through this contract via event emitters (`peer-found`, `peer-lost`, `visitor`).
2. **Module System**:
   - The backend uses CommonJS (`require()`, `module.exports`) and `.js` extensions. The `bare` runtime's module resolution for `.mjs` within subdirectories has strict limits, so CJS is the enforced standard for the backend logic.
3. **Data Schema (English)**:
   - All code, variables, and console outputs must be in **English**.
   - The data contract for a peer is: `id`, `name`, `category`, `status` (open/closed), `message`, `hours`, `updated`.
   - This is not a style preference: the contract is already implemented and frozen with these English names (`scan()`, `beacon()`, `peer-found`, `peer-lost`, `status`, `visitor`, `list()`, `update()`, `stop()`). Planning documents written in Spanish (specs, briefs, task lists) describe the same contract with Spanish names (`escanear`, `transmitir`, `local-encontrado`, etc.) for human readability only — those Spanish names are **not** an alternate or newer version of the contract and must never be written into code, commit messages, or instructions to an agent. If a planning doc and this file disagree on a name, this file wins.
4. **P2P Stack**:
   - DHT Discovery: `hyperswarm` (Topic: `towerbell-discovery-v1`).
   - Local Database Replication: `hyperbee` over `corestore`.
   - When running locally, the `corestore` path is suffixed with `process.pid` to avoid file-locking collisions when testing multiple instances on the same machine.

## Working Constraints

- **NO Refactors of working code**: As established by the team, "Si funciona feo, queda feo". Prioritize functional deliverables over architectural purity for hackathon constraints.
- **No external servers**: Do not introduce REST APIs, central databases, or web servers. The app must remain 100% P2P via Hyperswarm.

If asked to implement frontend/mobile features, refer to [`FRONTEND_INTEGRATION.md`](./FRONTEND_INTEGRATION.md) for the strict API boundaries.
