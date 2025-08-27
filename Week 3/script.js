const events = [
    "{0} sneaks up on {1} and eliminates them silently.",
    "{0} and {1} duel at sunrise. {0} survives.",
    "{0} sets a trap that catches {1}.",
    "{0} poisons {1}'s food while they’re distracted.",
    "{1} is bitten by a venomous snake — {0} watches from a distance.",
    "{0} and {1} form an alliance... but {0} betrays them.",
    "{1} falls while running from {0}.",
    "{0} ambushes {1} near the riverbank.",
    "{0} challenges {1} to a fight. It's short and brutal — {0} wins.",
    "{1} drinks unpurified water and doesn't make it. {0} survives another day."
];

function startGame() {
    const input = document.getElementById("tributeInput").value.trim();
    let tributes = input.split("\n").map(name => name.trim()).filter(Boolean);
    let story = "";

    if (tributes.length < 2) {
        alert("Please enter at least two tributes.");
        return;
    }

    let day = 1;
    story += `🌅 The Hunger Games Begin! ${tributes.length} tributes enter the arena.\n\n`;

    while (tributes.length > 1) {
        story += `📅 Day ${day}\n`;
        const eventsToday = Math.floor(Math.random() * 3) + 1;
        const usedPairs = new Set();

        for (let i = 0; i < eventsToday && tributes.length > 1; i++) {
            let killerIndex = Math.floor(Math.random() * tributes.length);
            let victimIndex;

            do {
                victimIndex = Math.floor(Math.random() * tributes.length);
            } while (
                victimIndex === killerIndex ||
                usedPairs.has(`${killerIndex},${victimIndex}`) ||
                usedPairs.has(`${victimIndex},${killerIndex}`)
            );

            let killer = tributes[killerIndex];
            let victim = tributes[victimIndex];
            usedPairs.add(`${killerIndex},${victimIndex}`);

            const eventTemplate = events[Math.floor(Math.random() * events.length)];
            const event = eventTemplate
                .replaceAll("{0}", killer)
                .replaceAll("{1}", victim);

            story += "🔪 " + event + "\n";

            tributes.splice(victimIndex, 1);
        }

        story += `\n🌙 Night falls. ${tributes.length} tribute${tributes.length === 1 ? "" : "s"} remain.\n\n`;
        day++;
    }

    story += `🏆 After ${day - 1} days of chaos, the winner is **${tributes[0]}**! Glory to the victor!\n`;
    document.getElementById("story").innerText = story;
}
