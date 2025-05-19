module onchainfc::club_nft {
    use std::string::String;

    public struct ClubNFT has key, store {
        id: UID,
        name: String,
        location: String,
        stadium: String,
        primary_color: String,
        secondary_color: String,
        logo_blob_id: String, // Contains reference to Walrus blobs
    }

    /// Public entry function to mint a new ClubNFT
    /// @param name - The name of the club
    /// @param walrus_blob_id - The reference to Walrus blobs (combined ID)
    public entry fun create_club(
        name: String,
        location: String,
        stadium: String,
        primary_color: String,
        secondary_color: String,
        logo_blob_id: String,
        ctx: &mut TxContext
    ) {
        let nft = ClubNFT {
            id: object::new(ctx),
            name,
            location,
            stadium,
            primary_color,
            secondary_color,
            logo_blob_id
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Get the name of a ClubNFT
    public fun get_name(nft: &ClubNFT): &String {
        &nft.name
    }

    /// Get the Walrus blob ID reference
    public fun get_logo_blob_id(nft: &ClubNFT): &String {
        &nft.logo_blob_id
    }
}