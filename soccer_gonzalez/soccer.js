const apiKey = '748f4b1e4d9b2a7168de30de2d6cb8aa';
const apiUrl = 'https://v3.football.api-sports.io';

async function fetchMatches() {
    try {
        const leagueId = 39; // Premier League (change later if needed)
        const url = `${apiUrl}/fixtures?league=${leagueId}&next=10`;

        const response = await fetch(url, {
            headers: { 'x-apisports-key': apiKey }
        });

        const data = await response.json();
        console.log("API data:", data);

        if (data.response.length === 0) {
            document.getElementById('matches').innerHTML = 'No matches found.';
            return;
        }

        displayMatches(data.response);
    } catch (error) {
        console.error('Error fetching matches:', error);
        document.getElementById('matches').innerHTML = 'Failed to load matches.';
    }
}

function displayMatches(matches) {
    const matchesDiv = document.getElementById('matches');
    matchesDiv.innerHTML = '';

    matches.forEach(match => {
        const matchEl = document.createElement('div');
        matchEl.classList.add('match');

        const homeTeam = match.teams.home.name;
        const awayTeam = match.teams.away.name;
        const date = new Date(match.fixture.date).toLocaleString();
        const score = `${match.goals.home} - ${match.goals.away}`;

        matchEl.innerHTML = `
      <strong>${homeTeam}</strong> vs <strong>${awayTeam}</strong><br>
      Date: ${date}<br>
      Score: ${score}<br>
      <button data-fixture-id="${match.fixture.id}">View Lineup</button>
    `;

        matchesDiv.appendChild(matchEl);
    });

    const buttons = matchesDiv.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const fixtureId = button.getAttribute('data-fixture-id');
            fetchLineup(fixtureId);
        });
    });
}

async function fetchLineup(fixtureId) {
    try {
        const response = await fetch(`${apiUrl}/lineups?fixture=${fixtureId}`, {
            headers: { 'x-apisports-key': apiKey }
        });
        const data = await response.json();

        if (data.response.length === 0) {
            document.getElementById('lineup-details').innerHTML = 'No lineup available for this match.';
            return;
        }

        displayLineup(data.response);
    } catch (error) {
        console.error('Error fetching lineup:', error);
        document.getElementById('lineup-details').innerHTML = 'Failed to load lineup.';
    }
}

function displayLineup(lineupData) {
    const lineupDiv = document.getElementById('lineup-details');
    lineupDiv.innerHTML = '';

    lineupData.forEach(team => {
        const teamEl = document.createElement('div');
        teamEl.innerHTML = `<h3>${team.team.name}</h3>`;

        team.startXI.forEach(playerObj => {
            const playerEl = document.createElement('div');
            playerEl.classList.add('player');
            playerEl.textContent = `${playerObj.player.name} - ${playerObj.player.pos}`;
            teamEl.appendChild(playerEl);
        });

        lineupDiv.appendChild(teamEl);
    });
}

fetchMatches();
