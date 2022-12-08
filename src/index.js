import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

// Fetch function //
const BASE_URL = 'https://restcountries.com/v3.1/name/';
const fields = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
    return fetch(`${BASE_URL}${name}?${fields}`)
      .then(r => r.json())
      .catch(e => console.log(e));
  }

const searchbox = document.querySelector('#search-box');  
const countryList = document.querySelector('country-list');
const countryInfo = document.querySelector('country-info');

searchbox.addEventListener('input' , debounce(onSearchbox , DEBOUNCE_DELAY));

function onSearchbox () {
    const name = searchbox.value.trim();
    if (name === '') {
        return (countryList.innerHTML = ''), (countryInfo.inner = '');
    }

fetchCountries(name)
  .then(countries =>{
    console.log('countries', countries);
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if (countries.length === 1){
        countryList.insertAdjacentElement('beforeend', createCountryList(countries));
        countryInfo.insertAdjacentElement('beforeend', createCountryInfo(countries));
    }else if(countries.length >= 10){
        alertTooManyMatches();
    }else {(
        countryList.insertAdjacentElement('beforeend', createCountryList(countries))
    );
    }
  })
  .catch(alertWrongName)
}

function createCountryInfo(countries) {
    const result = countries
        .map(({ capital, population, languages }) => {
            return `<p><b>Capital: </b>${capital}</p>
          <p><b>Population: </b>${population}</p>
          <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
        })
        .join('');
    return result;
}

function alertWrongName() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name')
};