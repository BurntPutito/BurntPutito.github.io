/**
 * The single source of truth for every project on this site.
 *
 * The projects table, the detail panel, and every project count are all
 * rendered from this array. To add a project, append one object below —
 * nothing else needs to change.
 *
 * Fields:
 *   id          Stable kebab-case key. Used for DOM lookups; don't reuse or rename casually.
 *   name        Display name.
 *   icon        Name of a Fluent icon in js/icons.js (e.g. 'game', 'phone'), shown
 *               in the table row and as the preview fallback when `image` is null.
 *   type        Short label for the table's Type column.
 *   date        Display date, e.g. 'Sep 2022'.
 *   status      'completed' | 'in-progress' | 'planned'. Drives the .status-* CSS class.
 *   tech        Array of technologies. Renders as tags.
 *   description Prose for the detail panel.
 *   duration    Optional. Omitted from the info grid when null.
 *   platform    Optional. Omitted from the info grid when null.
 *   repo        Repo URL, or null when there isn't a public one.
 *   repoStatus  'public' | 'private'. When 'private', the button renders disabled
 *               instead of vanishing, so visitors can see the project exists.
 *   demo        Demo URL, or null. The button is not rendered at all when null.
 *   image       Optional screenshot path. Falls back to `icon` when null.
 */

export const projects = [
    {
        id: 'cyberpunk-rainmeter',
        name: 'Cyberpunk Rainmeter Theme',
        icon: 'palette',
        type: 'UI/UX',
        date: 'Sep 2022',
        status: 'completed',
        tech: ['Rainmeter', 'Lua', 'Paint.NET', 'Scripting'],
        description: 'A sleek, futuristic Rainmeter theme inspired by cyberpunk aesthetics, featuring dynamic pixelated animations, customizable widgets (you can create your own), and a vibey neon color palette. It also comes with an optional Adventure Time mini pixelated art, with their own unique cute animation.',
        duration: '4 Weeks',
        platform: 'Windows',
        repo: 'https://github.com/BurntPutito/CyberpunkTheme-Rainmeter',
        repoStatus: 'public',
        demo: null,
        image: 'assets/images/CyberpunkPreview.png'
    },
    {
        id: 'jackshill-remastered',
        name: 'Jackshill Remastered',
        icon: 'phone',
        type: 'Mobile App',
        date: 'Mar 2025',
        status: 'completed',
        tech: ['Kotlin'], // TODO: confirm — inferred from the repo's primary language
        description: 'An extra step of JacksHill Assistant App.', // TODO: expand — seeded from the GitHub repo description
        duration: null,
        platform: null,
        repo: 'https://github.com/BurntPutito/JacksHill-AssistantApp-Remaster-',
        repoStatus: 'public',
        demo: null,
        image: null
    },
    {
        id: 'lalabot',
        name: 'Lalabot Application',
        icon: 'phone',
        type: 'Mobile App',
        date: 'Sep 2025',
        status: 'completed',
        tech: ['C#'], // TODO: confirm — inferred from the repo's primary language
        description: 'Application for using and monitoring Lalabot.', // TODO: expand — seeded from the GitHub repo description
        duration: null,
        platform: null,
        repo: 'https://github.com/BurntPutito/LalabotApplication',
        repoStatus: 'public',
        demo: null,
        image: null
    },
    {
        id: 'behind-corridors',
        name: 'Behind Corridors Horror Game',
        icon: 'game',
        type: 'Game',
        date: 'Jul 2025',
        status: 'completed',
        tech: [], // TODO: fill in
        description: '', // TODO: write a description
        duration: null,
        platform: null,
        repo: null,             // ← paste the URL here when the repo goes public
        repoStatus: 'private',
        demo: null,
        image: null
    },
    {
        id: 'minecraft-server-launcher',
        name: 'Minecraft Server Launcher',
        icon: 'server',
        type: 'Hosting Software',
        date: 'Jan 2026',
        status: 'in-progress',
        tech: [], // TODO: fill in
        description: '', // TODO: write a description
        duration: null,
        platform: null,
        repo: null,             // ← paste the URL here when the repo goes public
        repoStatus: 'private',
        demo: null,
        image: null
    },
    {
        id: 'minecraft-hud',
        name: 'Minecraft Full HUD Mod',
        icon: 'wrench',
        type: 'Game Mod',
        date: 'Jan 2025',
        status: 'completed',
        // GitHub reports this repo as ReScript, which is Linguist misreading the
        // file extensions rather than the truth. Left empty deliberately.
        tech: [], // TODO: fill in
        description: 'A simple Minecraft HUD that changes a few things.', // TODO: expand — seeded from the GitHub repo description
        duration: null,
        platform: 'Minecraft',
        repo: 'https://github.com/BurntPutito/MinecraftHUD',
        repoStatus: 'public',
        demo: null,
        image: null
    },
    {
        id: 'l4d2-healthbar',
        // Renamed from "Minecraft Healthbar Mod" — this is a Left 4 Dead 2 addon
        // styled to look like Minecraft, not a Minecraft mod.
        name: 'Minecraft-Style Healthbar (L4D2)',
        icon: 'wrench',
        type: 'Game Mod',
        date: 'Jan 2025',
        status: 'completed',
        tech: [], // TODO: fill in
        description: 'A Left 4 Dead 2 addon that changes the Health bar into Minecraft Style.', // TODO: expand — seeded from the GitHub repo description
        duration: null,
        platform: 'Left 4 Dead 2',
        repo: 'https://github.com/BurntPutito/Minecraft-Health-Bars-Addon',
        repoStatus: 'public',
        demo: null,
        image: null
    },
    {
        id: 'roll-a-ball',
        name: 'Roll A Ball',
        icon: 'game',
        type: 'Game',
        date: 'Jun 2025',
        status: 'completed',
        tech: ['Unity'], // TODO: confirm — inferred from the repo
        description: 'My first 3D Game from Unity.', // TODO: expand — seeded from the GitHub repo description
        duration: null,
        platform: null,
        repo: 'https://github.com/BurntPutito/RollABallGame',
        repoStatus: 'public',
        demo: null,
        image: null
    }
];

/** Human-readable labels for the `status` field. */
export const statusLabels = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'planned': 'Planned'
};
