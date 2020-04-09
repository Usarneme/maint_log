import '../sass/style.scss'

import typeAhead from './modules/typeAhead' // for AJAX requests to search the log postings db
import logDateFiller from './modules/logDateFiller' // helper func to deserialize and pretty format db date values
import removePhoto from './modules/removePhoto' // for AJAX requests to delete photo refs from the db
import vehicleSearch from './modules/vehicleSearch' // for AJAX requests to the vehicle query api
import toggleDarkMode from './modules/darkMode' 
import deleteLogEntry from './modules/deleteLogEntry'

typeAhead( document.querySelector('.search__container') )
removePhoto( document.querySelector('.logFormPhotosContainer') )
vehicleSearch( document.querySelector('.lookupSwitcher') )
logDateFiller()
toggleDarkMode()
deleteLogEntry(window.location.pathname)
