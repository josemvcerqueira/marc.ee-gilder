module gilder::gilder {

    use std::option::{ Option, some};
    use std::string::{Self, String};
    use std::vector::{ Self, empty, push_back, contains};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::clock::{Self, Clock};

    struct Gilder has key {
        id: UID,
        community : vector<Community>,
        members : vector<address>
    }

    struct Profile has key, store {
        id: UID,
        owner: address,
        avatar: Url
    }

    struct Community has key, store {
        id : UID,
        avatar : Option<Url>,
        cover_image: Option<Url>,
        creator: address,
        visible: bool,
        title: String,
        description: String,
        followers: vector<address>,
        members : vector<address>,
        posts : vector<Post>,
        created_at : u64
    }

    struct Post has key, store {
        id: UID,
        title: String,
        content: String,
        creator: address,
        vote: u64,
        comments: vector<Comment>
    }

    struct Comment has key, store {
        id: UID,
        creator: Profile,
        created_at: u64,
        content: String,
        reply: vector<Reply>
    }


    struct Reply has key, store {
        id : UID,
        creator: Profile,
        created_at: u64,
        content : String,
        replies : vector<String>
    }

    fun init(ctx: &mut TxContext) {
        let gilder = Gilder {
            id: object::new(ctx),
            community: empty(),
            members: empty()
        };
        transfer::share_object(gilder);
    }
public entry fun create_community(
        gilder: &mut Gilder,
        avatar: vector<u8>,
        cover_image: vector<u8>,
        visible: bool,
        title: vector<u8>,
        description: vector<u8>,
        clock_oject: &Clock,
        ctx: &mut TxContext
    ) {

        let creator = tx_context::sender(ctx);
        let _community = Community {
            id: object::new(ctx),
            avatar: some(url::new_unsafe_from_bytes(avatar)),
            cover_image: some(url::new_unsafe_from_bytes(cover_image)),
            creator,
            visible,
            title: string::utf8(title),
            description: string::utf8(description),
            followers: empty(),
            members: empty(),
            posts: empty(),
            created_at: clock::timestamp_ms(clock_oject)
        };

        let community_ref = &mut gilder.community;
        push_back(community_ref,  _community);

        if(!contains(&gilder.members, &creator)) {
            push_back(&mut gilder.members, creator)
        }
    }


    public entry fun post(
        gilder: &mut Gilder,
        community_index : u8,
        title: String,
        content: String,
        ctx: &mut TxContext
    ) {
        let _post = Post {
            id : object::new(ctx),
            title,
            content,
            creator : tx_context::sender(ctx),
            vote : 0,
            comments: empty()
        };
        let community = vector::borrow_mut(&mut gilder.community, (community_index as u64));
        vector::push_back(&mut community.posts, _post)
    }

    public fun get_all_communities(gilder: &Gilder) : &vector<Community> {
        return &gilder.community
    }
}