/*
 * Verbatim copy of the DEFAULT_CONFIG / DEFAULT_NAMES constants from the
 * original theAreanaSim/simulation.html script. Values are untouched.
 */

export const MAX_INVENTORY_SIZE = 4;
export const PLACEHOLDER_REGEX = /\{(\w+)\}/g;

export const DEFAULT_CONFIG = {
    lethal_event_chance: 0.35,
    inventory_event_chance: 0.45,
    loot_event_chance: 0.2,
    special_item_event_chance: 0.4,
    target_min_days: 7,
    target_max_days: 12,
    min_events_per_day: 1,
    max_events_per_day: 8,
    bloodbath_event_range: [6, 9],
    bloodbath_lethal_bonus: 0.25,
    inventory_items: [
        "medkit",
        "snare trap",
        "flare",
        "camouflage cloak",
        "ration pack",
        "throwing knife",
        "Taco Bell Meal Deal",
        "herb bundle",
        "bow"
    ],
    non_lethal_events: [
        "{person} scouts the cornucopia from afar.",
        "{person} gathers herbs and hopes they are edible.",
        "{person} reinforces a hidden bunker.",
        "{person} shares stories with the breeze\u2014silence answers back.",
        "{person} stalks distant footsteps but loses the trail.",
        {
            text: "{person} plots quietly with {ally} and {rival} deep into the night.",
            extra_roles: ["ally", "rival"]
        }
    ],
    lethal_events: [
        "{killer} ambushes {victim} near the river.",
        "{killer} traps {victim} in a ravine.",
        "{killer} outmatches {victim} after a tense duel.",
        "{killer} sabotages {victim}'s shelter overnight.",
        {
            text: "{killer} launches explosives that wipe out {victim} and {victim2}.",
            victim_count: 2
        }
    ],
    inventory_events: [
        "{person} sets a {item} and waits patiently.",
        "{person} patches wounds with a trusty {item}.",
        "{person} flashes a {item} to ward off pursuers.",
        "{person} retools a {item} into something even more dangerous."
    ],
    loot_events: [
        "{person} scavenges a {item} from the Cornucopia wreckage.",
        "{person} digs up a buried stash and pockets a {item}.",
        "{person} barters quietly for a {item}.",
        "{person} slips a {item} into their pack unnoticed."
    ],
    item_loot_text: {},
    special_item_events: [
        {
            item: "flare",
            consumes: true,
            events: [
                "{person} fires a {item}, flooding the sky with light and drawing watchers.",
                "{person} pops a {item} to blind anyone nearby and sprints for cover."
            ]
        },
        {
            item: "medkit",
            consumes: true,
            events: [
                "{person} spends the afternoon patching wounds with their {item}.",
                "{person} sacrifices a {item} to stabilize an ally\u2014grateful whispers follow."
            ]
        },
        {
            item: "snare trap",
            consumes: false,
            events: [
                {
                    text: "{person} rigs a {item} near the riverbank and waits for footsteps.",
                    consumes: false
                },
                {
                    text: "{person} repositions their {item}, tightening the perimeter.",
                    consumes: false
                },
                {
                    text: "{person}'s {item} snaps shut on {victim}, ending their run.",
                    lethal: true,
                    consumes: false
                },
                {
                    text: "{victim} and {victim2} never see the {item} that {person} left behind.",
                    lethal: true,
                    victim_count: 2,
                    consumes: false
                }
            ]
        },
        {
            item: "throwing knife",
            consumes: true,
            events: [
                {
                    text: "{person} hurls a {item} straight into {victim}.",
                    lethal: true,
                    consumes: true
                },
                {
                    text: "{person} stalks {victim} with a {item} and doesn't miss.",
                    lethal: true,
                    consumes: true
                },
                {
                    text: "{person} fans blades so fast that {victim} and {victim2} both fall.",
                    lethal: true,
                    victim_count: 2,
                    consumes: true
                }
            ]
        },
        {
            item: "Taco Bell Meal Deal",
            consumes: true,
            events: [
                "{person} eats their {item}.",
                {
                    text: "{person} shares their {item} with {victim}.",
                    consumes: false
                }
            ]
        },
        {
            item: "bow",
            consumes: false,
            events: [
                {
                    text: "{person} tends to their {item}.",
                    consumes: false
                },
                {
                    text: "{person} shoots {victim} with their {item}.",
                    lethal: true,
                    consumes: false
                },
                {
                    text: "{person} rains arrows until {victim} and {victim2} both drop.",
                    lethal: true,
                    victim_count: 2,
                    consumes: true
                }
            ]
        }
    ],
    victory_template: "{name} emerges victorious with {kills} elimination(s)!"
};

export const DEFAULT_NAMES = [
    "Will", "Alex", "Ty", "Eli", "Ethan", "Katrine",
    "Quinn", "Jash", "Kelly", "Chad", "CJ", "Raechel",
    "Hannah", "Camille", "Bryce", "Andy", "Anna", "Landon",
    "Kya", "Lars", "Sara", "Aubrey", "Katie", "Daniel"
];
