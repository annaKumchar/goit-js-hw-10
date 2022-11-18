import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries.js';
import templateInfoMarkup from './templates/country-info.hbs';
import templateListMarkup from './templates/country-list.hbs';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const onClearMarkup = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = countryInput.value.trim();
  if (name === '') {
    return onClearMarkup();
  }

  fetchCountries(name)
    .then(countries => {
      onClearMarkup();

      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          onRenderListMarkup(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          onRenderInfoMarkup(countries)
        );
      } else if (countries.length >= 10) {
        onAlertTooMany();
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          onRenderListMarkup(countries)
        );
      }
    })
    .catch(onAlertNotFound);
}

function onRenderListMarkup(countries) {
  const markup = countries
    .map(country => {
      return templateListMarkup(country);
    })
    .join('');
  return markup;
}

function onRenderInfoMarkup(countries) {
  const markup = countries
    .map(country => {
      return templateInfoMarkup(country);
    })
    .join('');
  return markup;
}

function onAlertNotFound() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onAlertTooMany() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
