import axios from 'axios'

export default function vehicleSearch(containingDiv) {
  // console.log('Vehicle Search JS loaded...')
  if (!containingDiv) return
  listeners()
}

function listeners() {
  // console.log('Setting up event listeners for vehicle searching...')
  document.querySelector('#searchByVin').addEventListener('click', e => changeSearchView(e, 'vin'))
  document.querySelector('#manualVehicleEntry').addEventListener('click', e => changeSearchView(e, 'manual'))
  document.querySelector('#vehicleLookup').addEventListener('click', e => changeSearchView(e, 'lookup'))
  document.querySelector('#vinSearchButton').addEventListener('click', e => vinSearch(e))
  
  const lookupMakeSelect = document.querySelector('select[name="lookupMake"]')
  // onchange and oninput work for desktop browsers but not for mobile...
  // lookupMakeSelect.addEventListener('change', e => lookupMakeQuery(e))
  // lookupMakeSelect.addEventListener('input', e => lookupMakeQuery(e))

  // using keyboard and mouse event listeners to work on desktop and mobile...
  lookupMakeSelect.addEventListener('keyup', e => lookupMakeQuery(e))
  lookupMakeSelect.addEventListener('mouseup', e => lookupMakeQuery(e))
  
  document.querySelector('select[name="lookupModel"]').addEventListener('change', e => modelSelected(e))
}

function changeSearchView(e, approach = 'manual') {
  // console.log('Search approach changer...')
  // console.log(e)

  e.stopPropagation()
  e.preventDefault()
  const vinDiv = document.querySelector('.searchByVinDiv')
  const manualDiv = document.querySelector('.manualVehicleEntryDiv')
  const lookupDiv = document.querySelector('.vehicleLookupDiv')

  const vinSwitcherButton = document.querySelector('.vinLookupButton')
  const manualSwitcherButton = document.querySelector('.manualVehicleEntryButton')
  const lookupSwitcherButton = document.querySelector('.vehicleLookupButton')

  if (approach === 'vin') {
    vinDiv.classList.remove('hidden')
    vinSwitcherButton.classList.add('selected')
    manualDiv.classList.add('hidden')
    manualSwitcherButton.classList.remove('selected')
    lookupDiv.classList.add('hidden')
    lookupSwitcherButton.classList.remove('selected')
  } else if (approach === 'manual') {
    manualDiv.classList.remove('hidden')
    manualSwitcherButton.classList.add('selected')
    vinDiv.classList.add('hidden')
    vinSwitcherButton.classList.remove('selected')
    lookupDiv.classList.add('hidden')
    lookupSwitcherButton.classList.remove('selected')
  } else if (approach === 'lookup') {
    lookupDiv.classList.remove('hidden')
    lookupSwitcherButton.classList.add('selected')
    manualDiv.classList.add('hidden')
    manualSwitcherButton.classList.remove('selected')
    vinDiv.classList.add('hidden')
    vinSwitcherButton.classList.remove('selected')
  }
}

function vinSearch(e) {
  e.stopPropagation()
  e.preventDefault()
  let vin = document.querySelector('input[name="vin"]').value || 0
  if (vin === 0) return
  // console.log('VIN Search clicked... Looking up '+vin)

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
        const confirmVinResultsButton = document.querySelector('#confirmVinResults')

        resultsDiv.innerHTML = `
          <div class="vinSearchResultsHeader">VIN Search Results:</div>
          <div class="vinSearchResult">
            <div>Year: ${year}</div><div>Make: ${make}</div><div>Model: ${model}</div>
          </div>`
        confirmVinResultsButton.on('click', e => updateVehicle(e, year, make, model))
        confirmVinResultsButton.classList.remove('hidden')
      } else {
        resultsDiv.textContent = `No Results Found for VIN "${vin}". Please try again.`
      }
    })
    .catch(err => console.error(err))
}

function lookupMakeQuery(e) {
  e.stopPropagation()
  e.preventDefault()
  const make = e.originalTarget.value
  if (!make) return
  console.log("Select changed. Calling lookupMakeQuery... "+make)

  const year = document.querySelector('select[name="lookupYear"]').value
  const modelLookupSelect = document.querySelector('select[name="lookupModel"]')
  while (modelLookupSelect.firstChild) {
    modelLookupSelect.removeChild(modelLookupSelect.lastChild)
  }

  const loadingOption = document.createElement('option')
  loadingOption.value = 'Loading data...'
  loadingOption.innerHTML = 'Loading data...'
  modelLookupSelect.appendChild(loadingOption)

  axios
    .get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make}/modelyear/${year}?format=json`)
    .then(data => {
      // clear out the models from any previous search
      while (modelLookupSelect.firstChild) {
        modelLookupSelect.removeChild(modelLookupSelect.lastChild)
      }
      let models = data.data["Results"]
      // alphabetize results
      models.sort((a, b) => {
        if (a["Model_Name"] > b["Model_Name"]) return 1
        if (a["Model_Name"] < b["Model_Name"]) return -1
        else return 0
      })
      // console.log(models)

      const emptyOption = document.createElement('option')
      emptyOption.disabled = 'disabled'
      emptyOption.selected = 'selected'
      emptyOption.value = 'Select a model...'
      emptyOption.innerHTML = 'Select a model...'
      modelLookupSelect.appendChild(emptyOption)

      models.forEach(result => {
        // console.log('Setting up select option for '+result["Model_Name"])
        const opt = document.createElement('option')
        opt.value = result["Model_Name"]
        opt.innerHTML = result["Model_Name"]
        modelLookupSelect.appendChild(opt)
      })
    })
    .catch(err => console.error(err))
}

function modelSelected(e) {
  e.stopPropagation()
  e.preventDefault()
  console.log('Model selected...')
  const year = document.querySelector('select[name="lookupYear"]').value
  const make = document.querySelector('select[name="lookupMake"]').value
  const model = e.originalTarget.value
  console.log(year, make, model)

  const confirmLookupResultsButton = document.querySelector('#confirmLookupResults')
  confirmLookupResultsButton.on('click', e => updateVehicle(e, year, make, model))
  confirmLookupResultsButton.classList.remove('hidden')
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