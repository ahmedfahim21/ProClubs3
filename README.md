# ⚽ ProClubs3

> Own. Manage. Simulate.  
> *An AI-driven Football Manager Simulation on the Sui Blockchain.*

ProClubs3 is a decentralized football management game where users create clubs, manage AI-generated players, and participate in tactical matches simulated by parallel AI agents. Built on the Sui blockchain, the game combines simulation, NFT-based ownership, and scalable off-chain data using Walrus.

---

## 🚀 Features

### 🏟️ Club & Squad Creation
- Mint a **Club NFT** with a custom name, logo, and identity.
- Auto-generate initial unique **Player NFTs** with stats, nationalities, positions, and AI-generated portraits.
- Clubs and players are fully on-chain, tradable assets.

### ⚔️ Match Simulation
- Users set tactics and challenge other clubs.
- Matches are simulated using **AI agents**, producing rich event logs.
- Match results are hashed and stored on-chain for integrity and transparency.

### 🛒 Player Transfers
- Players can be listed and sold using Sui's **Kiosk framework**.
- Open economy between clubs, powered by Sui Move smart contracts.

### 📅 Dynamic Challenges & Fixtures
- Users can challenge any active club.
- Challenge host earns randomized ticket revenue and bonus if victorious.
- No rigid league: flexible, asynchronous scheduling.

### 💰 In-Game Economy
- **Internal tokens** track ticket sales, match rewards.
- Can be evolved into a tokenized model later with DAO mechanics.

---

## 🧠 Tech Stack

| Layer | Tool |
|------|------|
| Blockchain | [Sui](https://sui.io) |
| Smart Contracts | Move |
| AI | [Gemini](https://ai.google.dev/gemini-api/docs) |
| Off-Chain Storage | [Walrus](https://docs.mystenlabs.com/walrus/) |
| Frontend | NextJS + Tailwind CSS + ShadCN |=

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/proclub3.git
cd proclub3
```

### 2. Deploy contract and create env file

```bash
cd contracts
sui move build
sui client publish
```

Copy the template from example.env and create .env file inside `/client` and add the IDs.

### 3. Start frontend

```bash
npm install
npm run dev
```

## Future Roadmap

- 🏆 League or tournament-based systems

- 🎓 Player training & development modules

- 👥 Use AI Agent Tools like Talus for on-chain simulations

- 🗳️ DAO-based league governance

- 🎨 Cosmetic customization (kits, stadium upgrades)

## Acknowledgements
- [Sui](https://docs.sui.io/concepts/)

- [Walrus Storage](https://docs.wal.app/dev-guide/components.html)

- Inspiration from classic football managers (FM, Top Eleven)

## Team

#### Solo Leveling

- Fahim Ahmed (ahmed.fahim0207@gmail.com)

---

Created at Sui OverFlow 2025 Hackathon
