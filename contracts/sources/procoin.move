module proclubs3::procoin {

    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance;
    use sui::sui::SUI;
    use sui::url;

    /// The PROCOIN token is the in-game currency for the ProClubs3 football simulation game.
    public struct PROCOIN has drop {}

    /// The MinterCap is a treasury cap that allows minting of PROCOIN tokens.
    public struct MinterCap has key {
        id: UID,
        cap: TreasuryCap<PROCOIN>,
    }

    /// The Vault is a structure that holds the balance of SUI tokens.
    public  struct Vault has key {
        id: UID,
        sui_balance: balance::Balance<SUI>,
    }

    /// Initializes the PROCOIN token and creates a treasury cap for minting.
    fun init(witness: PROCOIN, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness, 
            9, 
            b"PROCOIN", 
            b"ProClubs3 Token", 
            b"In-game currency for the ProClubs3 football simulation game",
            option::some(url::new_unsafe_from_bytes(b"https://ahmedfahim.vercel.app/ProCoin.png")),
            ctx
        );

        transfer::public_transfer(metadata, tx_context::sender(ctx));

        let minter_cap = MinterCap { 
            id: object::new(ctx), 
            cap: treasury_cap 
        };
        transfer::share_object(minter_cap);

        let vault = Vault { 
            id: object::new(ctx), 
            sui_balance: balance::zero<SUI>()
        };
        transfer::share_object(vault);
    }

    /// Function to mint the initial supply of PROCOIN tokens.
    public entry fun mint_starter_coins(
        minter_cap: &mut MinterCap,
        ctx: &mut TxContext
    ) {
        let amount = 1_000_000_000_000; // 1000 coins with 9 decimals
        mint(minter_cap, amount, tx_context::sender(ctx), ctx);
    }

    /// Function to mint a specified amount of PROCOIN rewards.
    public entry fun mint_reward(
        minter_cap: &mut MinterCap,
        amount: u64,
        ctx: &mut TxContext
    ) {
        mint(minter_cap, amount, tx_context::sender(ctx), ctx);
    }

    /// Function to burn a specified amount of PROCOIN tokens.
    public entry fun burn(
        minter_cap: &mut MinterCap,
        coin: Coin<PROCOIN>
    ) {
        coin::burn(&mut minter_cap.cap, coin);
    }

    /// Internal Function to mint a specified amount of PROCOIN tokens to a recipient.
    fun mint(
        minter_cap: &mut MinterCap,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(&mut minter_cap.cap, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }
}
