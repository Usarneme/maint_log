import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(logEntries) {
  return logEntries.map(log => {
    return `
      <a href="/log/${log.slug}" class="search__result">
        <strong>${log.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;
  console.log('Search input detected...')
  console.table(search)

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    if (!this.value) {
      searchResults.style.display = 'none';
      return; 
    }

    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        console.log('CLIENT - api search for '+this.value+'. Result: ')
        console.log(res.data)

        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
          return;
        }
        // If nothing came back...
        searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value}</div>`);
      })
      .catch(err => {
        console.error(err);
      });
  });

  searchInput.on('keyup', (e) => {
    // Ignore keys except up, down and enter for keyboard selection of result link
    if (![38, 40, 13].includes(e.keyCode)) {
      return; 
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1]
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;
