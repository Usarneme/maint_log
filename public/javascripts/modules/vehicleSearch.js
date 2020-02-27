import axios from 'axios'

export default function vehicleSearch(containingDiv) {
  console.log('Vehicle Search JS loaded...')
  if (!containingDiv) return
  listeners()
}

function listeners() {
  console.log('Setting up event listeners for vehicle searching...')
  const vinApproach = document.querySelector('#searchByVin')
  const manualApproach = document.querySelector('#manualVehicleEntry')
  const vinSearchButton = document.querySelector('#vinSearchButton')
  vinApproach.on('click', e => changeSearchView(e, 'vin'))
  manualApproach.on('click', e => changeSearchView(e, 'manual'))
  vinSearchButton.on('click', e => vinSearch(e))
}

function changeSearchView(e, approach = 'manual') {
  console.log('Search approach changer...')
  console.log(e)

  e.stopPropagation()
  e.preventDefault()
  const vinDiv = document.querySelector('.searchByVinDiv')
  const manualDiv = document.querySelector('.manualVehicleEntryDiv')
  const vinSwitcherButton = document.querySelector('.vinLookupButton')
  const manualSwitcherButton = document.querySelector('.manualVehicleEntryButton')

  if (approach === 'vin') {
    vinDiv.classList.remove('hidden')
    manualDiv.classList.add('hidden')
    vinSwitcherButton.classList.add('selected')
    manualSwitcherButton.classList.remove('selected')

  } else {
    manualDiv.classList.remove('hidden')
    vinDiv.classList.add('hidden')
    vinSwitcherButton.classList.remove('selected')
    manualSwitcherButton.classList.add('selected')
  } 
}

function vinSearch(e) {
  e.stopPropagation()
  e.preventDefault()
  let vin = document.querySelector('input[name="vin"]').value || 0
  if (vin === 0) return
  console.log('VIN Search clicked... Looking up '+vin)

  const resultsDiv = document.querySelector('.vehicleResults')
  resultsDiv.innerHTML = ''
  resultsDiv.textContent = ''

  axios
    .get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`)
    .then(data => {
      const results = data.data["Results"]
      // console.dir(results)

      const error = Number(results[4]["Value"][0])
      console.log('Error code: '+error)
      if (error === 0) {
        const year = results[9]["Value"]
        const rawMake = results[6]["Value"]
        const make = rawMake.charAt(0).toUpperCase() + rawMake.slice(1).toLowerCase()
        const model = results[8]["Value"]
        const updateButton = document.querySelector('#confirmResults')

        resultsDiv.innerHTML = `
          <div class="vinSearchResultsHeader">VIN Search Results:</div>
          <div class="vinSearchResult">
            <div>Year: ${year}</div><div>Make: ${make}</div><div>Model: ${model}</div>
          </div>`
        updateButton.on('click', e => updateVehicle(e, year, make, model))
        updateButton.classList.remove('hidden')
      } else {
        resultsDiv.textContent = `No Results Found for VIN "${vin}". Please try again.`
      }
    })
    .catch(err => console.error(err))
}

function updateVehicle(e, year, make, model) {
  e.stopPropagation()
  e.preventDefault()
  console.log('Update Vehicle button clicked...')
  const yearInput = document.querySelector('input[name="vehicleYear"]')
  const makeInput = document.querySelector('input[name="vehicleMake"]')
  const modelInput = document.querySelector('input[name="vehicleModel"]')

  yearInput.value = year
  makeInput.value = make
  modelInput.value = model
  changeSearchView(e, 'manual')
}