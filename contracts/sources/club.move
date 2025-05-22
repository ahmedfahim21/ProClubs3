module proclubs3::club {
    use std::string::String;

    public struct ClubNFT has key, store {
        id: UID,
        name: String,
        location: String,
        stadium: String,
        primary_color: String,
        secondary_color: String,
        logo_blob_id: String, // Contains reference to Walrus blobs
        owner: address,
        formation: String,
        style: String,
        matches_played: u64,
        matches_won: u64,
        matches_drawn: u64,
        matches_lost: u64,
        goals_scored: u64,
        goals_conceded: u64,
    }

    public struct ClubRegistry has key {
        id: UID,
        clubs: vector<ID>,
        total_clubs: u64,
    }

    public struct ClubCreated has copy, drop {
        club_id: ID,
        owner: address,
        name: String,
    }

    fun init(ctx: &mut TxContext) {
        let registry = ClubRegistry {
            id: object::new(ctx),
            clubs: vector::empty<ID>(),
            total_clubs: 0,
        };
        transfer::share_object(registry);
    }

    /// Public entry function to mint a new ClubNFT
    public entry fun create_club(
        registry: &mut ClubRegistry,
        name: String,
        location: String,
        stadium: String,
        primary_color: String,
        secondary_color: String,
        logo_blob_id: String,
        formation: String,
        style: String,
        matches_played: u64,
        matches_won: u64,
        matches_drawn: u64,
        matches_lost: u64,
        goals_scored: u64,
        goals_conceded: u64,
        ctx: &mut TxContext
    ) {
        let nft = ClubNFT {
            id: object::new(ctx),
            name,
            location,
            stadium,
            primary_color,
            secondary_color,
            logo_blob_id,
            owner: tx_context::sender(ctx),
            formation,
            style,
            matches_played,
            matches_won,
            matches_drawn,
            matches_lost,
            goals_scored,
            goals_conceded
        };

        let club_id = object::id(&nft);

        vector::push_back(&mut registry.clubs, club_id);
        registry.total_clubs = registry.total_clubs + 1;

        sui::event::emit(ClubCreated {
            club_id,
            owner: tx_context::sender(ctx),
            name: nft.name
        });


        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Update the matches stats of the ClubNFT
    public fun update_matches_stats(nft: &mut ClubNFT, matches_played: u64, matches_won: u64, matches_drawn: u64, matches_lost: u64, goals_scored: u64, goals_conceded: u64) {
        nft.matches_played = matches_played;
        nft.matches_won = matches_won;
        nft.matches_drawn = matches_drawn;
        nft.matches_lost = matches_lost;
        nft.goals_scored = goals_scored;
        nft.goals_conceded = goals_conceded;
    }

    /// Update tactics of the ClubNFT
    public fun update_tactics(nft: &mut ClubNFT, formation: String, style: String) {
        nft.formation = formation;
        nft.style = style;
    }
}