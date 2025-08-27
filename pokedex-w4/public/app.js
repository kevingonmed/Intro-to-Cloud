async function searchPokemon() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Loading...";
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error("Pokémon not found");
    const pokemon = await res.json();

    const weaknesses = await getWeaknesses(pokemon.types);
    const evolutions = await getEvolutions(pokemon.species.url);

    resultDiv.innerHTML = `
      <div class="card">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <h2>${pokemon.name.toUpperCase()}</h2>
        <div class="types">
          <strong>Type:</strong>
          ${pokemon.types.map(t => `<span class="type">${t.type.name}</span>`).join('')}
        </div>
        <div class="weaknesses">
          <strong>Weaknesses:</strong>
          ${weaknesses.map(w => `<span class="weakness">${w}</span>`).join('')}
        </div>
        <div class="abilities">
          <strong>Abilities:</strong>
          ${pokemon.abilities.map(a => `<span class="ability">${a.ability.name}</span>`).join(', ')}
        </div>
        <div class="evolutions">
          <strong>Evolution Line:</strong>
          ${evolutions.map(evo => `<span class="evolution">${evo}</span>`).join(' → ')}
        </div>
      </div>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>${error.message}</p>`;
  }
}

async function getWeaknesses(types) {
  const weaknesses = new Set();
  for (const t of types) {
    const res = await fetch(t.type.url);
    const data = await res.json();
    data.damage_relations.double_damage_from.forEach(w => weaknesses.add(w.name));
  }
  return Array.from(weaknesses);
}

async function getEvolutions(speciesUrl) {
  const res = await fetch(speciesUrl);
  const speciesData = await res.json();
  const evoRes = await fetch(speciesData.evolution_chain.url);
  const evoData = await evoRes.json();

  const evolutionChain = [];
  let evo = evoData.chain;

  while (evo) {
    evolutionChain.push(evo.species.name);
    evo = evo.evolves_to[0];
  }

  return evolutionChain;
}
