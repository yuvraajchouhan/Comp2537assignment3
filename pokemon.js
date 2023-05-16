
var pokemon = [];

// variable for how many pokemon show up on one page
const numPerPage = 10;

var numPages = 0;
const numPageBtn = 5;
//var currentPage = 1;

const setup = async () => {
    // using axios to grab data
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    console.log(response.data.results);

    // store results data in array
    pokemon = response.data.results;

    // determine how many pages are needed
    numPages = Math.ceil(pokemon.length / numPerPage);
    console.log("numPages: ", numPages);

    // start at page 1
    showPage(1);

    // creating a click event thats on the body element
    // run the function when click happens
    $('body').on('click', '.pokeCard', async function (e) {
        console.log(this);
        // get the name of the pokemon from the model
        const pokemonName = $(this).attr('pokeName');
        console.log('pokemonName: ', pokemonName);
        // grab information about the pokemon from the api based on its name
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        console.log('res.data: ', res.data);
        // create an array that stores only the names of the type
        const types = res.data.types.map((type) => type.type.name);
        console.log('types: ', types);
        // build the modal card with its pulled info
        // this modal gets rebuilt anytime the click happens
        $('.modal-body').html(`
        <div style='width:200px'>
            <img src="${res.data.sprites.other['official-artwork'].front_default}" alt='${res.data.name}'/>
            <div>
                <h3>Abilities</h3>
                <ul ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')} </ul>
            </div>
            <div>
                <h3>Stats </h3>
                <ul> ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')} </ul>
            </div>
        </div>
        <h3>Types</h3>
        <ul> ${types.map((type) => `<li>${type}</li>`).join('')} </ul>
        `)
        $('.modal-title').html(`<h2>${res.data.name}</h2>`)
    });


    $('body').on('click', '.pageBtn', async function (e) {
        // parse the page numb as an int so it doesnt act as a string
        const pageNum = parseInt($(this).attr('pageNum'));
        console.log('================pageBtn clicked');
        console.log('pageNum: ', pageNum);
        // based on the button clicked, show specific page
        showPage(pageNum);
    });

    console.log('end of setup');
};

    // function that shows the current page
    async function showPage(currentPage) {

        // verify the page cannot be less than one or more than total numb of pages
        if (currentPage < 1) {
            currentPage = 1;
        }
        if (currentPage > numPages) {
            currentPage = numPages;
        }

        console.log('showPage: ', currentPage);
        console.log('start: ', ((currentPage - 1) * numPerPage));
        console.log('end: ', ((currentPage - 1) * numPerPage) + numPerPage);
        console.log('pokemon.length: ', pokemon.length);

        // empty out the div 
        $('#pokemon').empty();
        //determine how many modals are going to be displayed based on the page number
        for (let i = ((currentPage - 1) * numPerPage); i < ((currentPage - 1) * numPerPage) + numPerPage && i < pokemon.length; i++) {
            // do another query to grab info about a specific pokemon
            let innerResponse = await axios.get(`${pokemon[i].url}`);
            // create variable to represent the current pokemon 
            let thisPokemon = innerResponse.data;
            // create a div for each pokemon that contains name and sprite
            $('#pokemon').append(`
        <div class="pokeCard card" pokeName=${thisPokemon.name}>
            <h3>${thisPokemon.name}</h3>
            <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
            <button type="button" class="btn btn-primary" data-bs-toggle='modal' data-bs-target='#pokeModal'>More</button>
            </div>
        `)
        }
    

    $('#pagination').empty();
    // start at 1 or the currentPage - 2
    var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
    // end at numb of pages or currentPage + 2
    var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));


    // add prev button if currentPage is more than 1
    if(currentPage > 1) {
        $('#pagination').append(`
            <button type='button' class='btn btn-primary pageBtn' id='pageprev' pageNum='${currentPage-1}'>Prev</button>`
        );
    }

    // create the button based on upper and lower limit
    for (let i = startI; i <= endI; i++) {
        var active = "";
        // insert active if i is on the current page
        if(i==currentPage){
            active = "active";
        }
        $('#pagination').append(`
        <button type='button' class='btn btn-primary pageBtn ${active}' id='page${i}' pageNum='${i}'>${i}</button>
        `);
    }

    // add a next button if not at the last page
    if(currentPage < numPages) {
        $('#pagination').append(`
        <button type='button' class='btn btn-primary pageBtn' id='pagenext' pageNum='${currentPage+1}'>Next</button>`
        );
    }

}

$(document).ready(setup)