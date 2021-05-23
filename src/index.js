var debounce = require('lodash.debounce')

import './sass/main.scss';
import countryTpl from './countryTpl.hbs';
import countreisListTpl from './countriesListTpl.hbs';
import API from './fetchCountries';
import getRefs from './get-refs';

// import pontyfy styles and js
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import { error } from '@pnotify/core/dist/PNotify.js';


const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onInput, 500));

function onInput(e) {
    const searchQuery = e.target.value;
    console.log(searchQuery);
    refs.countryContainer.innerHTML = '';
    API.fetchCountries(searchQuery)
        .then(data => {

            if (data.status === 404) {
                pontyfyMassage('Nothing was found for your query!')
            }
            else if (data.length > 10) {
                pontyfyMassage('Too many matches found. Please enter more specific query!');
            }
            else if (data.length === 1) {
                const countrysMarkup = createCountrytMarkup(data);
               refs.countryContainer.insertAdjacentHTML('beforeend', countrysMarkup);
            }
            else if (2 <= data.length <= 9) {
                const contrieaList = createCountriesList(data);
                refs.countryContainer.insertAdjacentHTML('beforeend', contrieaList);

            }
        }).catch(onError).finally(() => refs.searchInput = ' ');
};


function  createCountrytMarkup(data) {
    return countryTpl(data);
};

function createCountriesList(data) {
    return countreisListTpl(data)
};

function onError(error) {
    pontyfyMassage(error);
    console.log(error);
};

function pontyfyMassage(message) {
    error ({
            title: `${message}`,
            delay: 1200,
        });
}