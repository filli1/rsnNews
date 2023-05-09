
const assert = require('assert');
const searchForm = require('../public/js/script.js');

describe('Search form', () => {
  it('Extract form data', () => {
    // Set up the DOM for the test
    document.body.innerHTML = `
      <form id="searchForm">
        <input type="text" name="q" value="test query">
        <input type="date" name="from" value="2022-01-01">
        <input type="date" name="to" value="2022-05-08">
      </form>
    `;

    // Call the submit event listener function
    const form = document.getElementById('searchForm');
    const event = new Event('submit');
    form.dispatchEvent(event);

    // Check that the form data was correctly extracted
    assert.equal(searchParameter, 'test query/2022-01-01/2022-05-08');
  });
});
