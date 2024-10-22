let currentPokemonId = null;

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  dark: '#EE99AC',
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(', ');
}

function getEnglishFlavorText(pokemonSpecies) {
  const pok = pokemonSpecies.flavor_text_entries;
  const englishTexts = pok
    .filter((entry) => entry.language.name === 'en')
    .map((entry) => entry.flavor_text);
  return englishTexts.length > 0 ? englishTexts[0].replace(/\f/g, ' ') : '';
}

async function navigatePokemon(id) {
  currentPokemonId = id;
}

function handleLeftArrowClick() {
  navigatePokemon(currentPokemonId - 1);
}

function handleRightArrowClick() {
  navigatePokemon(currentPokemonId + 1);
}

function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    return;
  }

  const detailMainElement = document.querySelector('.detail-main');
  setElementStyles([detailMainElement], 'backgroundColor', color);
  setElementStyles([detailMainElement], 'borderColor', color);

  setElementStyles(
    document.querySelectorAll('.power-wrapper > p'),
    'backgroundColor',
    color,
  );

  setElementStyles(
    document.querySelectorAll('.stats-wrap p.stats'),
    'color',
    color,
  );

  setElementStyles(
    document.querySelectorAll('.stats-wrap .progress-bar'),
    'color',
    color,
  );

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
      background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
      background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}

function displayPokemonDetails(pokemon) {
  const {
    name, id, types, weight, height, abilities, stats,
  } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  document.querySelector('title').textContent = capitalizePokemonName;

  const detailMainElement = document.querySelector('.detail-main');
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector('.name-wrap .name').textContent = capitalizePokemonName;

  document.querySelector('.pokemon-id-wrap .body2-fonts').textContent = `#${String(id).padStart(3, '0')}`;

  const imageElement = document.querySelector('.detail-img-wrapper img');
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  const typeWrapper = document.querySelector('.power-wrapper');
  typeWrapper.innerHTML = '';
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, 'p', {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  document.querySelector('.pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight').textContent = `${weight / 10}kg`;
  document.querySelector('.pokemon-detail-wrap .pokemon-detail p.body3-fonts.height').textContent = `${height / 10}m`;

  const abilitiesWrapper = document.querySelector('.pokemon-detail-wrap .pokemon-detail.move');
  abilitiesWrapper.innerHTML = '';
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, 'p', {
      className: 'body3-fonts',
      textContent: ability.name,
    });
  });

  const statsWrapper = document.querySelector('.stats-wrapper');
  statsWrapper.innerHTML = '';

  const statNameMapping = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SATK',
    'special-defense': 'SDEF',
    speed: 'SPD',
  };

  stats.forEach(({ stat, base }) => {
    const statDiv = document.createElement('div');
    statDiv.className = 'stats-wrap';
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, 'p', {
      className: 'body3-fonts stats',
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, 'p', {
      className: 'body3-fonts',
      textContent: String(base).padStart(3, '0'),
    });

    createAndAppendElement(statDiv, 'progress', {
      className: 'progress-bar',
      value: base,
      max: 100,
    });
  });

  setTypeBackgroundColor(pokemon);
}

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
    ]);

    const abilitiesWrapper = document.querySelector('.pokemon-detail-wrap .pokemon-detail.move');
    abilitiesWrapper.innerHTML = '';

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector('.body3-fonts.pokemon-description').textContent = flavorText;

      const [leftArrow, rightArrow] = ['#leftArrow', '#rightArrow'].map((sel) => document.querySelector(sel));
      leftArrow.removeEventListener('click', handleLeftArrowClick);
      rightArrow.removeEventListener('click', handleRightArrowClick);

      if (id !== 1) {
        leftArrow.addEventListener('click', handleLeftArrowClick);
      }
      if (id !== 151) {
        rightArrow.addEventListener('click', handleRightArrowClick);
      }

      window.history.pushState({}, '', `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const MAX_POKEMONS = 151;
  const pokemonID = new URLSearchParams(window.location.search).get('id');
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    window.location.href = './index.html';
    return;
  }

  currentPokemonId = id;
  loadPokemon(id);
});
