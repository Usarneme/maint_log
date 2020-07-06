import React from 'react'
import axios from 'axios'
import { ReactSVG } from 'react-svg'
import { toast } from 'react-toastify'

import SearchResults from './SearchResults'
import Loading from './Loading'
import MagnifyingGlassIcon from '../images/magnifying.svg'

import '../styles/search.css'

class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      results: [],
      searching: false,
      counter: 0
    }
  }

  getInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/search?q=${this.state.query}`)
      if (response.data.length) {
        this.setState({
          results: response.data,
          searching: false
        }) 
      }
    } catch (err) {
        console.log('Error posting to /api/search')
        console.dir(err)
        toast('Error searching log data! Please try again.')
        return
    }
  }

  handleInputChange = e => {
    e.preventDefault()
    this.setState({
      query: e.target.value,
      searching: true,
      results: []
    }, () => {
      // only query the API at most 2x per second (every 500 ms)
      if (this.state.query && this.state.query.length > 1 && Date.now() - this.state.counter > 500) {
        this.getInfo()
        this.setState({ counter: Date.now() })
      } else { // wait half a second, then query
        setTimeout(() => {
          this.getInfo()
        }, 500)
      }
    })
  }

  blurCleanup = () => {
    if (this.state.query.length === 0) this.setState({ results: [] })
  }

  clearInput = e => {
    e.preventDefault()
    this.setState({ query: '', searching: false, results: [] })
  }

  render() {
    const buttonImg = this.state.query && this.state.query.length > 0 ? 
      <strong>&times;</strong> :
      <ReactSVG src={MagnifyingGlassIcon} role="img" aria-label="Magnifying Glass Icon" fallback={() => <img src={MagnifyingGlassIcon} alt="magnifying glass icon" description="magnifying glass icon" className="svg" />} /> 

    return (
      <form className="search__form">
        <div className="search__input__container">
          <input
            placeholder="Search parts, service, etc..."
            onKeyUp={this.handleInputChange}
            onChange={this.handleInputChange}
            onBlur={this.blurCleanup}
            value={this.state.query}
            className='search__input'
          />
          <button className="button search__button" onClick={this.clearInput}>{buttonImg}</button>
        </div>
        {this.state.loading && <Loading message={`Searching for: ${this.state.query}`} />}
        {this.state.results && this.state.results.length > 0 &&
          <SearchResults homepage={this.props.homepage} results={this.state.results} /> 
        }
        {this.state.results.length === 0 && this.state.query.length > 0 &&
          <h5>No match found for that search...</h5>
        }
      </form>
    )
  }
}

export default SearchBox
