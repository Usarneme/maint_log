import React from 'react'
import PropTypes from 'prop-types'

import { manufacturers } from '../../helpers'

class VLYMM extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      year: new Date().getFullYear(),
      make: '',
      models: [],
      model: '',
      showConfirmButton: false
    }
  }

  async lookupModelsByYearAndMake() {
    // console.log("Select changed. Calling lookupMakeQuery... ")
    if (!this.state || !this.state.year || !this.state.make) {
      return console.log('leaving lookup early due to no year or make selected...')
    }
    // console.log('Make selected: '+this.state.make)
    // check for a local cache of the query
    const localStorageKey = this.state.year.toString() + this.state.make.toString()
    const localStorageModels = localStorage.getItem(localStorageKey)
    if (localStorageModels !== null) {
      console.log('Duplicate query. Retrieving cache from localStorage...')
      const localStorageModelsArray = localStorageModels.split(',') // turns comma-delineated string into array of strings
      console.log(localStorageModelsArray)
      this.setState({ models: localStorageModelsArray, showConfirmButton: false })
    } else {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${this.state.make}/modelyear/${this.state.year}?format=json`)
        .then(async data => {
          const json = await data.json()
          let models = json["Results"]
          // alphabetize results
          models.sort((a, b) => {
            if (a["Model_Name"] > b["Model_Name"]) return 1
            if (a["Model_Name"] < b["Model_Name"]) return -1
            else return 0
          })
          const modelsArray = models.map(model => model["Model_Name"])
          // console.log(modelsArray)
          // cache query results
          if (modelsArray.length > 0) localStorage.setItem(localStorageKey, modelsArray)
          this.setState(prevState => ({ models: [...modelsArray], showConfirmButton: false }))
        })
        .catch(err => console.error(err))
    }
  }
  
  handleSelectChange = async event => {
    event.preventDefault()
    // await state change before calling the next method as that relies on the updated state value...
    await this.setState({ [event.target.name]: event.target.value })
    if (this.state && this.state.year && this.state.make) {
      this.lookupModelsByYearAndMake()
    }
    if (this.state && this.state.year && this.state.make && this.state.models && this.state.model) {
      await this.setState({ showConfirmButton: true })
    }
  }

  render() {
    const thisYear = new Date().getFullYear()

    return (
      <div className="form vehicleLookupDiv">
        <div className="vehicleLookupInput">
          <label htmlFor="year">Year</label>
          <select name="year" defaultValue={thisYear} onChange={this.handleSelectChange}>
            { 
              Array.from(Array(thisYear - 1920).keys()).map((item, i) => <option key={i} value={thisYear - i}>{thisYear - i}</option> )
            }
          </select>
          <label htmlFor="make">Make</label>
          <select name="make" defaultValue="" onChange={this.handleSelectChange}>
            <option value="" disabled="disabled">Select a manufacturer...</option>
            {
              manufacturers.map((val, idx) => <option key={val} value={val}>{val}</option> )
            }
          </select>
          <label htmlFor="model">Model</label>
          <select name="model" defaultValue="First select a make..." onChange={this.handleSelectChange}>
            <option value="First select a make..." disabled="disabled">First select a manufacturer...</option>
            { this.state.models.length > 0 &&
              this.state.models.map((val, idx) => <option key={val} value={val}>{val}</option> )
            }
          </select>
      </div>
      { this.state.showConfirmButton && 
        <button className="button" onClick={() => this.props.saveNewVehicle(this.state)}>Add Vehicle To Account</button>
      }
    </div>
    )
  }
}

VLYMM.propTypes = {
  saveNewVehicle: PropTypes.func.isRequired
}

export default VLYMM