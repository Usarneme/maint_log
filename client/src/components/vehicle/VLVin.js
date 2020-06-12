import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../Loading'

class VLVin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      vin: '',
      resultsError: null,
      vehicle: {
        make: '',
        model: '',
        year: ''
      },
      loading: false
    }
  }

  handleInputChange = event => {
    this.setState({ vin: event.target.value })
  }

  vinSearch = async event => {
    event.stopPropagation()
    event.preventDefault()
    if (!this.state.vin) return
    await this.setState({ loading: true })
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${this.state.vin}?format=json`)
      const data = await response.json()
      const results = await data["Results"]
      // Per the NHTSA API spec (https://vpic.nhtsa.dot.gov/api/):
      const error = Number(results[4]["Value"][0])
      if (error === 0) {
        const year = results[9]["Value"]
        const rawMake = results[6]["Value"]
        const make = rawMake.charAt(0).toUpperCase() + rawMake.slice(1).toLowerCase()
        const model = results[8]["Value"]
        this.setState({ vehicle: { year, make, model }, loading: false })
      } else {
        this.setState({ resultsError: `No Results Found for VIN "${this.state.vin}". Please try again.`, loading: false })
      }
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    if (this.state.loading) return <Loading message="Searching for VIN..." />

    return (
      <div className="searchByVinDiv">
        <div className="vinSearchInput">
          <label htmlFor="vin">VIN</label>
          <input type="text" name="vin" value={this.state.vin} onChange={this.handleInputChange} />
          <button className="button" onClick={this.vinSearch}>Search For VIN</button>
        </div>
        <div className="vehicleResults">
          { this.state.resultsError && <span>{this.state.resultsError}</span> }
          { !this.state.resultsError && this.state.vehicle && this.state.vehicle.make.length > 0 &&
            <>
              <h4>Vehicle Found</h4>
              <span>{`Year: ${this.state.vehicle.year}`}</span>
              <span>{`Make: ${this.state.vehicle.make}`}</span>
              <span>{`Model: ${this.state.vehicle.model}`}</span>
              <button className="button" onClick={() => this.props.saveNewVehicle({ vin: this.state.vin, ...this.state.vehicle })}>Add Vehicle To Account</button>
            </>          
          }
        </div>
      </div>
    )
  }
}

VLVin.propTypes = {
  saveNewVehicle: PropTypes.func.isRequired
}

export default VLVin