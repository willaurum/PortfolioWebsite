/*
 * The Hunger Games simulation engine, copied verbatim from the original
 * theAreanaSim/simulation.html script. No mechanics, probabilities, text,
 * character handling, or ordering has been altered - the only changes are the
 * `export` keyword on simulateArena and the import of the shared constants.
 */
import { MAX_INVENTORY_SIZE, PLACEHOLDER_REGEX } from "./arenaConfig.js";

export function simulateArena(names, config) {
    const tributes = names.map((name) => ({
        name,
        alive: true,
        kills: 0,
        inventory: assignInventory(config)
    }));

    const total = tributes.length;
    const desiredDays = determineDesiredDays(total, config);
    const days = [];
    let dayCounter = 0;
    let daysWithoutDeath = 0;
    const specialItemMap = buildSpecialItemMap(config);

    const alive = () => tributes.filter((t) => t.alive);

    while (alive().length > 1) {
        dayCounter += 1;
        const events = [];
        const fallen = [];
        const livingCount = alive().length;
        const target = eventsForDay(dayCounter, livingCount, total, config, desiredDays);
        const deathPressure = computeDeathPressure(
            livingCount,
            dayCounter,
            target,
            config,
            desiredDays
        );

        for (let i = 0; i < target; i += 1) {
            const living = alive();
            if (!living.length) break;
            const actor = pickRandom(living);
            const event = generateEvent(
                actor,
                tributes,
                config,
                dayCounter,
                specialItemMap,
                deathPressure
            );
            if (!event) continue;
            events.push(event);
            if (event.type === "lethal" || event.type === "item-special lethal") {
                const victims = Array.isArray(event.meta?.victims)
                    ? event.meta.victims
                    : event.meta?.victim
                    ? [event.meta.victim]
                    : [];
                victims.forEach((name) => {
                    if (name && !fallen.includes(name)) {
                        fallen.push(name);
                    }
                });
            }
            if (alive().length <= 1) break;
        }

        if (fallen.length) {
            daysWithoutDeath = 0;
        } else {
            daysWithoutDeath += 1;
            if (daysWithoutDeath >= 3 && alive().length > 1) {
                const forcedEvent = forceMandatoryDeath(tributes, config);
                if (forcedEvent) {
                    events.push(forcedEvent);
                    const forcedVictims = Array.isArray(forcedEvent.meta?.victims)
                        ? forcedEvent.meta.victims
                        : forcedEvent.meta?.victim
                        ? [forcedEvent.meta.victim]
                        : [];
                    forcedVictims.forEach((name) => {
                        if (name && !fallen.includes(name)) {
                            fallen.push(name);
                        }
                    });
                    daysWithoutDeath = 0;
                }
            }
        }

        days.push({
            number: dayCounter,
            bloodbath: dayCounter === 1,
            events,
            fallen,
            survivors: alive().map((t) => t.name)
        });
    }

    const winner = tributes.find((t) => t.alive) || tributes[0];
    if (winner && days.length) {
        days[days.length - 1].events.push({
            type: "victory",
            text: config.victory_template
                .replace("{name}", winner.name)
                .replace("{kills}", winner.kills),
            meta: { winner: winner.name, kills: winner.kills }
        });
    }

    return { tributes, days, winner: winner ? winner.name : null };
}

function eventsForDay(dayNumber, aliveCount, total, config, desiredDays) {
    if (dayNumber === 1 && Array.isArray(config.bloodbath_event_range)) {
        const range = config.bloodbath_event_range.slice(0, 2);
        const low = Math.max(config.min_events_per_day, Math.floor(range[0] ?? config.max_events_per_day));
        const high = Math.max(low, Math.floor(range[1] ?? range[0] ?? low));
        return randomInt(low, high);
    }

    const span = Math.max(0, (config.max_events_per_day ?? 4) - (config.min_events_per_day ?? 2));
    const density = total ? aliveCount / total : 0;
    const base = (config.min_events_per_day ?? 2) + Math.max(0, Math.round(span * density));
    const jitter = span ? pickRandom([-1, 0, 0, 1]) : 0;
    let target = base + jitter;
    const killPressureEvents = requiredEventsForProgress(
        dayNumber,
        aliveCount,
        desiredDays,
        config
    );
    target = Math.max(target, killPressureEvents);
    const softCap = Math.max(Math.min(8, aliveCount), killPressureEvents);
    return clamp(
        Math.min(target, aliveCount, softCap),
        config.min_events_per_day ?? 2,
        Math.max(softCap, config.max_events_per_day ?? Math.max(2, target))
    );
}

function generateEvent(actor, tributes, config, dayNumber, specialItemMap, deathPressure) {
    const living = tributes.filter((t) => t.alive);
    const canAttemptLethal = living.length > 1;

    const specialItems = actor.inventory.filter((item) => specialItemMap[item]);
    if (
        specialItems.length &&
        Math.random() < (config.special_item_event_chance ?? 0.4)
    ) {
        const item = pickRandom(specialItems);
        const payload = specialItemMap[item];
        const events = payload?.events ?? [];
        if (events.length) {
            const template = pickRandom(events);
            const consumes =
                template.consumes ?? payload.consumes ?? false;
            let victims = [];
            if (template.victimCount) {
                const victimChoices = living.filter((t) => t !== actor);
                if (victimChoices.length < template.victimCount) {
                    return null;
                }
                victims = pickUnique(victimChoices, template.victimCount) ?? [];
                if (victims.length < template.victimCount) {
                    return null;
                }
            }
            if (template.lethal && victims.length) {
                victims.forEach((target) => {
                    target.alive = false;
                });
                actor.kills += victims.length;
            }
            const replacements = { person: actor.name, item };
            victims.forEach((victim, index) => {
                const key =
                    template.victimKeys[index] ??
                    (index === 0 ? "victim" : `victim${index + 1}`);
                replacements[key] = victim.name;
            });
            const text = formatTemplate(template.text, replacements);
            const meta = {
                person: actor.name,
                item,
                consumed: Boolean(consumes)
            };
            if (victims.length) {
                meta.victims = victims.map((v) => v.name);
                meta.victim = victims[0].name;
            }
            if (consumes) {
                removeItemOnce(actor.inventory, item);
            }
            return {
                type: template.lethal && victims.length ? "item-special lethal" : "item-special",
                text,
                meta
            };
        }
    }

    const lootPool = Array.isArray(config.loot_events) ? config.loot_events : [];
    const inventoryPool = Array.isArray(config.inventory_items) ? config.inventory_items : [];
    const itemLootMap = config.item_loot_text ?? {};
    if (
        inventoryPool.length &&
        actor.inventory.length < MAX_INVENTORY_SIZE &&
        Math.random() < (config.loot_event_chance ?? 0.25)
    ) {
        const item = pickRandom(inventoryPool);
        actor.inventory.push(item);
        const overrides = Array.isArray(itemLootMap[item]) ? itemLootMap[item] : [];
        const templates = overrides.length ? overrides : lootPool;
        const fallback = "{person} quietly pockets a {item}.";
        const template = templates.length ? pickRandom(templates) : fallback;
        return {
            type: "loot",
            text: formatTemplate(template, { person: actor.name, item }),
            meta: { person: actor.name, item }
        };
    }

    if (
        actor.inventory.length &&
        (config.inventory_events?.length ?? 0) &&
        Math.random() < (config.inventory_event_chance ?? 0.35)
    ) {
        const item = pickRandom(actor.inventory);
        const template = pickRandom(config.inventory_events);
        return {
            type: "inventory",
            text: formatTemplate(template, { person: actor.name, item }),
            meta: { person: actor.name, item }
        };
    }

    let lethalChance = config.lethal_event_chance ?? 0.55;
    if (dayNumber === 1) {
        lethalChance = Math.min(1, lethalChance + (config.bloodbath_lethal_bonus ?? 0.25));
    }
    lethalChance = clamp(lethalChance * deathPressure, 0.05, 0.95);

    const lethalPool =
        config.lethal_events && config.lethal_events.length
            ? config.lethal_events
            : ["{killer} eliminates {victim}."];
    if (canAttemptLethal && Math.random() < lethalChance) {
        const victimChoices = living.filter((t) => t !== actor);
        if (victimChoices.length) {
            const template = normalizeLethalTemplate(pickRandom(lethalPool));
            const count = Math.min(
                Math.max(1, template.victimCount),
                victimChoices.length
            );
            const victims = pickUnique(victimChoices, count) ?? [];
            if (!victims.length) {
                return null;
            }
            victims.forEach((target) => {
                target.alive = false;
            });
            actor.kills += victims.length;
            const replacements = { killer: actor.name };
            victims.forEach((victim, index) => {
                const key =
                    template.victimKeys[index] ??
                    (index === 0 ? "victim" : `victim${index + 1}`);
                replacements[key] = victim.name;
            });
            return {
                type: "lethal",
                text: formatTemplate(template.text, replacements),
                meta: {
                    killer: actor.name,
                    victim: victims[0].name,
                    victims: victims.map((v) => v.name)
                }
            };
        }
    }

    const nonLethalPool =
        config.non_lethal_events && config.non_lethal_events.length
            ? config.non_lethal_events
            : ["{person} lies low and watches the horizon."];
    const template = normalizeNonLethalTemplate(pickRandom(nonLethalPool));
    const replacements = { person: actor.name };
    let companions = [];
    if (template.extraRoles.length) {
        const pool = living.filter((t) => t !== actor);
        if (pool.length < template.extraRoles.length) {
            return null;
        }
        companions = pickUnique(pool, template.extraRoles.length) ?? [];
        if (companions.length < template.extraRoles.length) {
            return null;
        }
        companions.forEach((tribute, index) => {
            replacements[template.extraRoles[index]] = tribute.name;
        });
    }
    const meta = { person: actor.name };
    if (companions.length) {
        meta.others = companions.map((t) => t.name);
    }
    return {
        type: "non-lethal",
        text: formatTemplate(template.text, replacements),
        meta
    };
}

function forceMandatoryDeath(tributes, config) {
    const living = tributes.filter((t) => t.alive);
    if (living.length < 2) {
        return null;
    }
    const actor = pickRandom(living);
    const victimChoices = living.filter((t) => t !== actor);
    if (!victimChoices.length) {
        return null;
    }
    const lethalPool =
        config.lethal_events && config.lethal_events.length
            ? config.lethal_events
            : ["{killer} eliminates {victim}."];
    const template = normalizeLethalTemplate(pickRandom(lethalPool));
    const count = Math.min(Math.max(1, template.victimCount), victimChoices.length);
    const victims = pickUnique(victimChoices, count) ?? [];
    if (!victims.length) {
        return null;
    }
    victims.forEach((target) => {
        target.alive = false;
    });
    actor.kills += victims.length;
    const replacements = { killer: actor.name };
    victims.forEach((victim, index) => {
        const key =
            template.victimKeys[index] ??
            (index === 0 ? "victim" : `victim${index + 1}`);
        replacements[key] = victim.name;
    });
    return {
        type: "lethal",
        text: formatTemplate(template.text, replacements),
        meta: {
            killer: actor.name,
            victim: victims[0].name,
            victims: victims.map((v) => v.name),
            forced: true
        }
    };
}

function assignInventory(config) {
    const pool = config.inventory_items ?? [];
    if (!pool.length) return [];
    const count = randomInt(0, Math.min(2, MAX_INVENTORY_SIZE));
    const items = [];
    for (let i = 0; i < count; i += 1) {
        items.push(pickRandom(pool));
    }
    return items;
}

function buildSpecialItemMap(config) {
    const entries = config.special_item_events ?? [];
    const map = {};
    entries.forEach((entry) => {
        if (!entry?.item || !(entry.events?.length)) {
            return;
        }
        const defaultConsumes = Boolean(entry.consumes);
        const normalized = entry.events
            .map((evt) => normalizeSpecialEvent(evt, defaultConsumes))
            .filter(Boolean);
        if (!normalized.length) {
            return;
        }
        map[entry.item] = {
            events: normalized,
            consumes: defaultConsumes
        };
    });
    return map;
}

function determineDesiredDays(total, config) {
    const minDays = Math.max(1, config.target_min_days ?? 7);
    const maxDays = Math.max(minDays, config.target_max_days ?? 12);
    if (total <= 1 || minDays === maxDays) {
        return minDays;
    }
    const ratio = clamp((total - 2) / 22, 0, 1);
    const span = maxDays - minDays;
    return Math.round(minDays + span * ratio);
}

function requiredEventsForProgress(dayNumber, aliveCount, desiredDays, config) {
    if (aliveCount <= 1) {
        return 0;
    }
    const remainingDays = Math.max(1, desiredDays - (dayNumber - 1));
    const neededEliminations = Math.max(0, aliveCount - 1);
    const targetKills = Math.max(1, Math.ceil(neededEliminations / remainingDays));
    let baseChance = config.lethal_event_chance ?? 0.55;
    if (dayNumber === 1) {
        baseChance = Math.min(1, baseChance + (config.bloodbath_lethal_bonus ?? 0.25));
    }
    const effectiveChance = clamp(baseChance, 0.1, 0.95);
    return Math.ceil(targetKills / effectiveChance);
}

function computeDeathPressure(aliveCount, dayNumber, dailyEvents, config, desiredDays) {
    if (aliveCount <= 1 || dailyEvents <= 0) {
        return 1;
    }
    const remainingDays = Math.max(1, desiredDays - (dayNumber - 1));
    const neededEliminations = Math.max(0, aliveCount - 1);
    const targetKills = neededEliminations / remainingDays;
    let baseChance = config.lethal_event_chance ?? 0.55;
    if (dayNumber === 1) {
        baseChance = Math.min(1, baseChance + (config.bloodbath_lethal_bonus ?? 0.25));
    }
    const expectedKills = dailyEvents * clamp(baseChance, 0.05, 0.95);
    const pressure = targetKills / Math.max(expectedKills, 0.1);
    const lateGameBonus = 1 + Math.max(0, dayNumber - 10) * 0.5;
    return clamp(pressure * lateGameBonus, 0.6, 4);
}

function extractPlaceholders(template) {
    if (!template) return [];
    const matches = [];
    template.replace(PLACEHOLDER_REGEX, (_, key) => {
        matches.push(key);
        return _;
    });
    return matches;
}

function inferVictimRoles(template) {
    return extractPlaceholders(template).filter(
        (key, index, arr) => key.startsWith("victim") && arr.indexOf(key) === index
    );
}

function ensureVictimKeys(baseKeys, count) {
    const keys = Array.isArray(baseKeys) ? [...baseKeys] : [];
    const defaults = ["victim"];
    for (let i = 2; i <= count + 5; i += 1) {
        defaults.push(`victim${i}`);
    }
    defaults.forEach((candidate) => {
        if (keys.length >= count) {
            return;
        }
        if (!keys.includes(candidate)) {
            keys.push(candidate);
        }
    });
    return keys.slice(0, count);
}

function inferExtraRoles(template, baseKeys) {
    const reserved = new Set(baseKeys);
    const roles = [];
    extractPlaceholders(template).forEach((key) => {
        if (reserved.has(key)) return;
        if (!roles.includes(key)) {
            roles.push(key);
        }
    });
    return roles;
}

function normalizeSpecialEvent(entry, defaultConsumes) {
    if (typeof entry === "string") {
        const victimRoles = inferVictimRoles(entry);
        const victimCount = victimRoles.length;
        return {
            text: entry,
            lethal: false,
            victimCount,
            victimKeys: ensureVictimKeys(victimRoles, victimCount),
            consumes: defaultConsumes
        };
    }
    if (entry && typeof entry === "object" && "text" in entry) {
        const text = String(entry.text);
        const lethal = Boolean(entry.lethal);
        const victimRoles = inferVictimRoles(text);
        const explicit = entry.victim_count ?? entry.victimCount ?? entry.victims;
        let victimCount = victimRoles.length;
        if (explicit !== undefined) {
            const parsed = Number(explicit);
            if (!Number.isNaN(parsed)) {
                victimCount = Math.max(0, Math.floor(parsed));
            }
        }
        if (lethal && victimCount === 0) {
            victimCount = victimRoles.length || 1;
        }
        const consumes =
            "consumes" in entry ? Boolean(entry.consumes) : defaultConsumes;
        return {
            text,
            lethal,
            victimCount,
            victimKeys: ensureVictimKeys(victimRoles, victimCount),
            consumes
        };
    }
    return null;
}

function normalizeNonLethalTemplate(entry) {
    if (typeof entry === "string") {
        return {
            text: entry,
            extraRoles: inferExtraRoles(entry, ["person"])
        };
    }
    if (entry && typeof entry === "object" && "text" in entry) {
        const text = String(entry.text);
        const rolesSource = entry.extra_roles ?? entry.extraRoles;
        const roles = Array.isArray(rolesSource)
            ? rolesSource.map((role) => String(role))
            : inferExtraRoles(text, ["person"]);
        return { text, extraRoles: roles };
    }
    return { text: "{person} lies low and watches the horizon.", extraRoles: [] };
}

function normalizeLethalTemplate(entry) {
    if (typeof entry === "string") {
        const victimRoles = inferVictimRoles(entry);
        const victimCount = victimRoles.length || 1;
        return {
            text: entry,
            victimCount,
            victimKeys: ensureVictimKeys(victimRoles, victimCount)
        };
    }
    if (entry && typeof entry === "object") {
        const text = String(entry.text ?? "{killer} eliminates {victim}.");
        const victimRoles = inferVictimRoles(text);
        const explicit = entry.victim_count ?? entry.victimCount ?? entry.victims;
        let victimCount = victimRoles.length || 1;
        if (explicit !== undefined) {
            const parsed = Number(explicit);
            if (!Number.isNaN(parsed) && parsed > 0) {
                victimCount = Math.floor(parsed);
            }
        }
        const resolved = Math.max(1, victimCount);
        return {
            text,
            victimCount: resolved,
            victimKeys: ensureVictimKeys(victimRoles, resolved)
        };
    }
    return {
        text: "{killer} eliminates {victim}.",
        victimCount: 1,
        victimKeys: ["victim"]
    };
}

function pickUnique(list, count) {
    if (count <= 0) return [];
    if (!Array.isArray(list) || list.length < count) {
        return null;
    }
    const pool = [...list];
    const picks = [];
    for (let i = 0; i < count; i += 1) {
        const index = Math.floor(Math.random() * pool.length);
        picks.push(pool.splice(index, 1)[0]);
    }
    return picks;
}

function removeItemOnce(inventory, item) {
    const index = inventory.indexOf(item);
    if (index !== -1) {
        inventory.splice(index, 1);
    }
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function formatTemplate(template, replacements) {
    return template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? `{${key}}`);
}
