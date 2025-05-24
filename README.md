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
- Clubs are stored in a ClubRegistry as dynamic fields, so that others can view them.

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
- Internal token **PROCOIN** can track ticket sales, match rewards.
- Can be evolved into a tokenized model later with DAO mechanics.

---

## 🧠 Tech Stack

![image](https://github.com/user-attachments/assets/b8b0dba9-2f42-4de1-8675-80348ea8c2a0)

| Layer | Tool |
|------|------|
| Blockchain | [Sui](https://sui.io) |
| Smart Contracts | Move |
| AI | [Gemini](https://ai.google.dev/gemini-api/docs) |
| Off-Chain Storage | [Walrus](https://docs.mystenlabs.com/walrus/) |
| Frontend | NextJS + Tailwind CSS + ShadCN |=

---

## Screenshots

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/333b87ff-e104-4ecb-b38e-5b5d7f1a2aac" />

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/1764539e-c190-4848-8a0a-f63b1bf6e0e2" />


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

- 🎓 Player training & development modules, injuries, ageing

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
