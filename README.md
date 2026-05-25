# RocketForge

**Build and simulate rockets to understand real spaceflight engineering.**

An interactive educational tool that teaches the rocket equation, staging, engine selection, and basic orbital mechanics through hands-on construction.

## Features
- Real physics using the Tsiolkovsky rocket equation
- Multi-stage rocket builder
- Live performance calculations (Δv, TWR, burn time)
- Animated launch simulation
- Educational insights based on your design choices
- Fully client-side (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

This project is configured for **static export** and deploys cleanly to Cloudflare Pages.

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## Tech Stack
- Next.js 16 (static export)
- TypeScript
- Tailwind CSS
- Framer Motion

## Educational Goals
RocketForge was built to help people moving toward hardware/engineering roles (such as at SpaceX) develop intuition for propulsion systems by building and simulating real configurations.

## License
MIT

---

Built as part of an ongoing self-directed hardware & systems engineering education track.