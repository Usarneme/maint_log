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
  // lookupMakeSelect.addEventListener('change', e => lookupMakeQuery(e))
  lookupMakeSelect.addEventListener('input', e => lookupMakeQuery(e))

  // using keyboard and mouse event listeners wont' work on mobile, onChange is supported everywhere
  // lookupMakeSelect.addEventListener('keyup', e => lookupMakeQuery(e))
  // lookupMakeSelect.addEventListener('mouseup', e => lookupMakeQuery(e))
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
  // 73.25 nav 93 heading + 297.5 account card ~= 463px to the top of the Vehicle Search element
  window.scrollTo(0, 463) // scroll down so the inputs are in view
}

function vinSearch(e) {
  e.stopPropagation()
  e.preventDefault()
  let vin = document.querySelector('input[name="vinput"]').value || 0
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
        confirmVinResultsButton.addEventListener('click', e => updateVehicle(e, year, make, model, vin))
        confirmVinResultsButton.classList.remove('hidden')
      } else {
        resultsDiv.textContent = `No Results Found for VIN "${vin}". Please try again.`
      }
    })
    .catch(err => console.error(err))
}

function lookupMakeQuery(e) {
  // console.log("Select changed. Calling lookupMakeQuery... ")
  e.stopPropagation()
  e.preventDefault()

  // console.log(e)
  let make = undefined

  // Firefox style is e.originalTarget.value, Chromium style is e.target.value for selected option
  if (e.originalTarget !== undefined) {
    make = e.originalTarget.value
  } else {
    make = e.target.value
  }
  if (!make) return
  // console.log('Make selected: '+make)
  const year = document.querySelector('select[name="lookupYear"]').value

  // clear out any models from the select from a previous query
  const modelLookupSelect = document.querySelector('select[name="lookupModel"]')
  while (modelLookupSelect.firstChild) {
    modelLookupSelect.removeChild(modelLookupSelect.lastChild)
  }

  const loadingOption = document.createElement('option')
  loadingOption.value = 'Loading data...'
  loadingOption.innerHTML = 'Loading data...'
  modelLookupSelect.appendChild(loadingOption)

  // check for a local cache of the query
  const localStorageKey = year.toString() + make.toString()
  const localStorageModels = localStorage.getItem(localStorageKey)

  // clear out the models from any previous search
  while (modelLookupSelect.firstChild) {
    modelLookupSelect.removeChild(modelLookupSelect.lastChild)
  }

  if (localStorageModels !== null) {
    // console.log('Duplicate query. Retreiving cache from localStorage...')
    const localStorageModelsArray = localStorageModels.split(',') // turns comma-delineated string into array of strings
    // console.log(localStorageModelsArray)
    buildModelSelectFrom(localStorageModelsArray)
  } else {
    axios
      .get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make}/modelyear/${year}?format=json`)
      .then(data => {
        let models = data.data["Results"]
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
        buildModelSelectFrom(modelsArray)
      })
      .catch(err => console.error(err))
  }
}

function buildModelSelectFrom(models) {
  const modelLookupSelect = document.querySelector('select[name="lookupModel"]')

  if (models.length > 0) {
    const emptyOption = document.createElement('option')
    emptyOption.disabled = 'disabled'
    emptyOption.selected = 'selected'
    emptyOption.value = 'Select a model...'
    emptyOption.innerHTML = 'Select a model...'
    modelLookupSelect.appendChild(emptyOption)

    models.forEach(model => {
      const opt = document.createElement('option')
      opt.value = model
      opt.innerHTML = model
      modelLookupSelect.appendChild(opt)
    })  
  } else {
    const opt = document.createElement('option')
    opt.disabled = 'disabled'
    opt.selected = 'selected'
    opt.value = 'No models found...'
    opt.innerHTML = 'No models found...'
    modelLookupSelect.appendChild(opt)
  }
}

function modelSelected(e) {
  e.stopPropagation()
  e.preventDefault()
  // console.log('Model selected...')
  const year = document.querySelector('select[name="lookupYear"]').value
  const make = document.querySelector('select[name="lookupMake"]').value

  let model = undefined

  if (e.originalTarget !== undefined) {
    model = e.originalTarget.value
  } else {
    model = e.target.value
  }
  // console.log(year, make, model)
  const confirmLookupResultsButton = document.querySelector('#confirmLookupResults')
  confirmLookupResultsButton.addEventListener('click', e => updateVehicle(e, year, make, model))
  confirmLookupResultsButton.classList.remove('hidden')
}

function updateVehicle(e, year, make, model, vin = '') {
  e.stopPropagation()
  e.preventDefault()
  // console.log('Update Vehicle button clicked...')
  const yearInput = document.querySelector('input[name="vehicleYear"]')
  const makeInput = document.querySelector('input[name="vehicleMake"]')
  const modelInput = document.querySelector('input[name="vehicleModel"]')

  yearInput.value = year
  makeInput.value = make
  modelInput.value = model

  if (vin !== '') {
    const vinInput = document.querySelector('input[name="vin"]')
    vinInput.value = vin  
  }
  changeSearchView(e, 'manual')
}
