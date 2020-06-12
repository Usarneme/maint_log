import React from 'react'
import { Link } from 'react-router-dom'

function SearchResults(props) {
  return (
    <section className="search__results" >
      <h4>Results: </h4>
      <div>
        {props.results.map((result, index) => (
          <div key={result.id} className="card search__result">
            <h3>{result.name}</h3>
            <p className="result__detail">{result.shortDescription}</p>
            <div className="search__result__buttons">
              <Link to={`log/${result.slug}`} className="button">View</Link>
              <Link to={`log/${result.id}/edit`} className="button">Edit</Link>            
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SearchResults