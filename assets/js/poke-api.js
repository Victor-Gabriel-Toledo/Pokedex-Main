


const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
 
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    const abilities = pokeDetail.abilities.map((abilitiesSlot) => abilitiesSlot.ability.name)

    pokemon.abilities = abilities

    const stats = pokeDetail.stats.map((statSlot) => ({
        name: statSlot.stat.name,
        value: statSlot.base_stat
    }))

    pokemon.stats = stats

    return pokemon
}

pokeApi.getPokemonsDetails = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetails))
        .then((detailRequest) => Promise.all(detailRequest))
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => console.error(error))   
}

pokeApi.getPokemonsEggGroups = (url) => {
    return fetch(url)
        .then((response) => response.json())
}

pokeApi.getPokemonByName = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}/`
    return fetch(url)
        .then((response) => response.json())
        .then((breeding) => {
            const pokemon = convertPokeApiDetailToPokemon(breeding)

            return pokeApi.getPokemonsEggGroups(breeding.species.url)
                .then((specieData) => {
                    pokemon.eggGroup = specieData.egg_groups.map((g) => g.name)
                    pokemon.eggCycle = specieData.hatch_counter
                    return pokemon
                })
                
        }) 
}