webpackHotUpdate("app",{

/***/ "./public/javascripts/modules/typeAhead.js":
/*!*************************************************!*\
  !*** ./public/javascripts/modules/typeAhead.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js?bc3a");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dompurify */ "./node_modules/dompurify/dist/purify.js");
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_1__);



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
  if (!search) return; // console.log('Search input detected...')
  // console.table(search)

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');
  searchInput.addEventListener('input', function () {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`/api/search?q=${this.value}`).then(res => {
      // console.log('CLIENT - api search for '+this.value+'. Result: ')
      // console.log(res.data)
      if (res.data.length) {
        searchResults.innerHTML = dompurify__WEBPACK_IMPORTED_MODULE_1___default.a.sanitize(searchResultsHTML(res.data));
        return;
      } // If nothing came back...


      searchResults.innerHTML = dompurify__WEBPACK_IMPORTED_MODULE_1___default.a.sanitize(`<div class="search__result">No results for ${this.value}</div>`);
    }).catch(err => {
      console.error(err);
    });
  });
  searchInput.addEventListener('keyup', e => {
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
      next = current.previousElementSibling || items[items.length - 1];
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

/* harmony default export */ __webpack_exports__["default"] = (typeAhead);

/***/ })

})
//# sourceMappingURL=app.eee2d37a53cc0ee62ffa.hot-update.js.map