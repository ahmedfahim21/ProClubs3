module proclubs3::transfer {
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};
    use sui::coin::{Coin};
    use sui::sui::SUI;
    use sui::transfer_policy::{Self, TransferPolicy};
    use proclubs3::player::{PlayerNFT};

    /// Function to list a player in the shared kiosk
    public entry fun list_player(
        player: PlayerNFT,
        kiosk: &mut Kiosk,
        cap: &KioskOwnerCap,
        price: u64,
    ) {
        let player_id = object::uid_to_inner(proclubs3::player::get_id(&player));
        kiosk::place(kiosk, cap, player);
        kiosk::list<PlayerNFT>(kiosk, cap, player_id, price);
    }

    /// Function to buy a player from the kiosk
    public entry fun buy_player(
        seller_kiosk: &mut Kiosk,
        player_id: ID,
        payment: Coin<SUI>,
        transfer_policy: &TransferPolicy<PlayerNFT>,
        ctx: &mut TxContext
    ) {
        let (player, transfer_request) = kiosk::purchase<PlayerNFT>(seller_kiosk, player_id, payment);
        transfer_policy::confirm_request(transfer_policy, transfer_request);
        transfer::public_transfer(player, tx_context::sender(ctx));
    }


    /// Function to delist a player from the kiosk
    public entry fun delist_player(
        kiosk: &mut Kiosk,
        cap: &KioskOwnerCap,
        player_id: ID,
        ctx: &mut TxContext
    ) {
        assert!(kiosk::has_item(kiosk, player_id), 0);
        
        kiosk::delist<PlayerNFT>(kiosk, cap, player_id);
        
        let player = kiosk::take<PlayerNFT>(kiosk, cap, player_id);
        
        transfer::public_transfer(player, tx_context::sender(ctx));
    }
}

