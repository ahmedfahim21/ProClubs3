module proclubs3::player {
    use std::string::String;

    public struct PlayerNFT has key, store {
        id: UID,
        name: String,
        nationality: String,
        position: String,
        speed: u8,
        shooting: u8,
        passing: u8,
        dribbling: u8,
        defending: u8,
        physical: u8,
        age: u8,
        image_blob_id: String, // Contains reference to Walrus blobs
    }

    /// Public entry function to mint a new PlayerNFT
    public entry fun create_player(
        name: String,
        nationality: String,
        position: String,
        speed: u8,
        shooting: u8,
        passing: u8,
        dribbling: u8,
        defending: u8,
        physical: u8,
        age: u8,
        image_blob_id: String,
        ctx: &mut TxContext
    ) {
        let nft = PlayerNFT {
            id: object::new(ctx),
            name,
            nationality,
            position,
            speed,
            shooting,
            passing,
            dribbling,
            defending,
            physical,
            age,
            image_blob_id
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

}