module proclubs3::marketplace {
    use sui::kiosk;
    use sui::package::Publisher;
    use sui::transfer_policy;
    use proclubs3::player::PlayerNFT;

    /// One-time setup function to create the shared marketplace kiosk
    public entry fun create_shared_marketplace(ctx: &mut TxContext) {
        // Create the marketplace kiosk
        let (kiosk, cap) = kiosk::new(ctx);
        
        // Share the kiosk so everyone can access it
        transfer::public_share_object(kiosk);
        
        // Transfer the cap to the sender
        transfer::public_transfer(cap, tx_context::sender(ctx));
    }
    #[allow(lint(share_owned, self_transfer))]
    public entry fun new_policy(publisher: &Publisher, ctx: &mut TxContext) {
        let (policy, policy_cap) = transfer_policy::new<PlayerNFT>(publisher, ctx);
        transfer::public_share_object(policy);
        transfer::public_transfer(policy_cap, tx_context::sender(ctx));
    }
}

// sui client call \
//   --package $PACKAGE_ID \
//   --module marketplace \
//   --function create_shared_marketplace \

// sui client call --package $PACKAGE_ID --module marketplace --function new_policy --args $KIOSK_PUBLISHER 