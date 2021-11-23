export interface Card {
  cardId: string;
  dbfId: string;
  name: string;
  cardSet: CardSet;
  type?: Type;
  text?: string;
  playerClass?: Class;
  locale: string;
  rarity?: Rarity;
  health?: number;
  mechanics?: Mechanic[];
  faction?: Faction;
  elite?: boolean;
  cost?: number;
  attack?: number;
  race?: Race;
  img?: string;
  flavor?: string;
  artist?: string;
  spellSchool?: SpellSchool;
  collectible?: boolean;
  imgGold?: string;
  durability?: number;
  howToGetGold?: string;
  howToGet?: string;
  armor?: string;
  classes?: Class[];
  multiClassGroup?: string;
  howToGetDiamond?: string;
}

export enum CardSet {
  AshesOfOutland = 'Ashes of Outland',
  Battlegrounds = 'Battlegrounds',
  BlackrockMountain = 'Blackrock Mountain',
  Classic = 'Classic',
  Core = 'Core',
  Credits = 'Credits',
  DemonHunterInitiate = 'Demon Hunter Initiate',
  DescentOfDragons = 'Descent of Dragons',
  ForgedInTheBarrens = 'Forged in the Barrens',
  FracturedInAlteracValley = 'Fractured in Alterac Valley',
  GalakrondSAwakening = "Galakrond's Awakening",
  GoblinsVsGnomes = 'Goblins vs Gnomes',
  HallOfFame = 'Hall of Fame',
  HeroSkins = 'Hero Skins',
  JourneyToUnGoro = "Journey to Un'Goro",
  KnightsOfTheFrozenThrone = 'Knights of the Frozen Throne',
  KoboldsCatacombs = 'Kobolds & Catacombs',
  Legacy = 'Legacy',
  MadnessAtTheDarkmoonFaire = 'Madness At The Darkmoon Faire',
  MeanStreetsOfGadgetzan = 'Mean Streets of Gadgetzan',
  Mercenaries = 'Mercenaries',
  Missions = 'Missions',
  Naxxramas = 'Naxxramas',
  OneNightInKarazhan = 'One Night in Karazhan',
  RastakhanSRumble = "Rastakhan's Rumble",
  RiseOfShadows = 'Rise of Shadows',
  SaviorsOfUldum = 'Saviors of Uldum',
  ScholomanceAcademy = 'Scholomance Academy',
  TavernBrawl = 'Tavern Brawl',
  TavernsOfTime = 'Taverns of Time',
  TheBoomsdayProject = 'The Boomsday Project',
  TheGrandTournament = 'The Grand Tournament',
  TheLeagueOfExplorers = 'The League of Explorers',
  TheWitchwood = 'The Witchwood',
  UnitedInStormwind = 'United in Stormwind',
  Vanilla = 'Vanilla',
  WhispersOfTheOldGods = 'Whispers of the Old Gods'
}

export enum Class {
  DeathKnight = 'Death Knight',
  DemonHunter = 'Demon Hunter',
  Dream = 'Dream',
  Druid = 'Druid',
  Hunter = 'Hunter',
  Mage = 'Mage',
  Neutral = 'Neutral',
  Paladin = 'Paladin',
  Priest = 'Priest',
  Rogue = 'Rogue',
  Shaman = 'Shaman',
  Warlock = 'Warlock',
  Warrior = 'Warrior',
  Whizbang = 'Whizbang'
}

export enum Faction {
  Alliance = 'Alliance',
  Horde = 'Horde',
  Neutral = 'Neutral'
}

export interface Mechanic {
  name: Name;
}

export enum Name {
  AIMustPlay = 'AIMustPlay',
  Adapt = 'Adapt',
  AdjacentBuff = 'AdjacentBuff',
  AffectedBySpellPower = 'AffectedBySpellPower',
  Aura = 'Aura',
  AvengeX = 'Avenge (X)',
  Battlecry = 'Battlecry',
  BloodGem = 'Blood Gem',
  CastsWhenDrawn = 'Casts When Drawn',
  Charge = 'Charge',
  Combo = 'Combo',
  Corrupt = 'Corrupt',
  Deathrattle = 'Deathrattle',
  Discover = 'Discover',
  DivineShield = 'Divine Shield',
  Echo = 'Echo',
  Freeze = 'Freeze',
  Frenzy = 'Frenzy',
  ImmuneToSpellpower = 'ImmuneToSpellpower',
  Inspire = 'Inspire',
  InvisibleDeathrattle = 'InvisibleDeathrattle',
  Invoke = 'Invoke',
  JadeGolem = 'Jade Golem',
  Lifesteal = 'Lifesteal',
  Magnetic = 'Magnetic',
  Morph = 'Morph',
  NatureSpellDamage = 'Nature Spell Damage',
  OneTurnEffect = 'OneTurnEffect',
  Outcast = 'Outcast',
  Overkill = 'Overkill',
  Overload = 'Overload',
  Poisonous = 'Poisonous',
  Quest = 'Quest',
  Questline = 'Questline',
  Reborn = 'Reborn',
  Recruit = 'Recruit',
  Rush = 'Rush',
  Secret = 'Secret',
  Sidequest = 'Sidequest',
  Silence = 'Silence',
  SpellDamage = 'Spell Damage',
  Spellburst = 'Spellburst',
  Stealth = 'Stealth',
  Summoned = 'Summoned',
  Taunt = 'Taunt',
  Tradeable = 'Tradeable',
  Twinspell = 'Twinspell',
  Windfury = 'Windfury'
}

export enum Race {
  All = 'All',
  Beast = 'Beast',
  Demon = 'Demon',
  Dragon = 'Dragon',
  Elemental = 'Elemental',
  Mech = 'Mech',
  Murloc = 'Murloc',
  Pirate = 'Pirate',
  Quilboar = 'Quilboar',
  Totem = 'Totem'
}

export enum Rarity {
  Common = 'Common',
  Epic = 'Epic',
  Free = 'Free',
  Legendary = 'Legendary',
  Rare = 'Rare'
}

export enum SpellSchool {
  Arcane = 'Arcane',
  Fel = 'Fel',
  Fire = 'Fire',
  Frost = 'Frost',
  Holy = 'Holy',
  Nature = 'Nature',
  Shadow = 'Shadow'
}

export enum Type {
  Enchantment = 'Enchantment',
  Hero = 'Hero',
  HeroPower = 'Hero Power',
  Minion = 'Minion',
  Spell = 'Spell',
  Weapon = 'Weapon'
}

export interface CardsInfo {
  patch: string;
  classes: string[];
  sets: string[];
  standard: string[];
  wild: string[];
  types: string[];
  factions: string[];
  qualities: string[];
  races: string[];
  locales: Locales;
}

export interface Locales {
  DE_DE: string;
  EN_GB: string;
  EN_US: string;
  ES_ES: string;
  ES_MX: string;
  FR_FR: string;
  IT_IT: string;
  KO_KR: string;
  PL_PL: string;
  PT_BR: string;
  RU_RU: string;
  ZH_CN: string;
  ZH_TW: string;
  JA_JP: string;
  TH_TH: string;
}
