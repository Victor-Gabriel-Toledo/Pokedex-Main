


const nameType = document.getElementById('nameType')
const listAtributos = document.getElementById('listAtributos')
const bgColor = document.querySelector('.backgroundType')
const base_stats = document.querySelector('.base_stats')

const urlParams = new URLSearchParams(window.location.search)
const pokemonName = urlParams.get('pokemon')

function formatHeight(height) {
    const heightInMeter = height / 10

    if (heightInMeter < 1) {
        const heightInCm = height * 10
        return `0,${heightInCm} cm`
    } else {
        return `${heightInMeter.toFixed(1)}0 m`
    }
}

function getStatsClass(level) {
    if (level < 45) {
        return `low`
    } else if (level >= 45 && level < 60) {
        return `medium`
    } else {
        return `high`
    }
}

function loadPokemonDetail(name) {
    pokeApi.getPokemonByName(name).then((pokemon) => {
        bgColor.classList.add(`${pokemon.type}`)

        // cores do(s) tipo(s) usadas no gradiente de fundo (ver poke-detail.css)
        bgColor.style.setProperty('--c1', `var(--type-${pokemon.types[0]})`)
        if (pokemon.types[1]) {
            bgColor.style.setProperty('--c2', `var(--type-${pokemon.types[1]})`)
        }

        nameType.innerHTML = `
                <div class="nameNumber">
                    <h2>${pokemon.name}</h2>
                    <p id="number">#${pokemon.number}</p>
                </div>

                <div class="types">
                    ${pokemon.types.map((type) => `<p class="${type}">${type}</p>`).join('')}
                </div>

                <div class="imagePokemon">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
        `

        listAtributos.innerHTML = `
                <ul class="list about__list">
                    <li>
                        <p class="label">Height</p>
                        <p>${formatHeight(pokemon.height)}</p>
                    </li>
                    <li>
                        <p class="label">Weight</p>
                        <p>${pokemon.weight} lbs</p>
                    </li>
                    <li>
                        <p class="label">Abilities</p>
                        <div class="value">
                            <p>${pokemon.abilities.map((ability) => ability).join(', ')}</p>
                        </div>
                    </li>
                </ul>

                <h3 style="color: black;">Breeding</h3>

                <ul class="list about__list">
                    <li>
                        <p class="label">Egg Groups</p>
                        <p class="value">${pokemon.eggGroup.join(', ')}</p>
                    </li>
                    <li>
                        <p class="label">Egg Cycle</p>
                        <p>${pokemon.eggCycle}</p>
                    </li>
                </ul>
        `
        base_stats.innerHTML = `
            <ul>
                ${pokemon.stats.map((s) => `
                    <li>
                        <p class="label">${s.name}</p>
                        <p class="value">${s.value}</p>
                        <div class="bar">
                            <div class="fill ${getStatsClass(s.value)}" style="width: ${s.value}%;"></div>
                        </div>
                    </li>
                `).join(' ')}
            </ul>
        `
    })
}

loadPokemonDetail(pokemonName)
