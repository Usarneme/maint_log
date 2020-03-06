import '../sass/style.scss'

import typeAhead from './modules/typeAhead'
import logDateFiller from './modules/logDateFiller'
import removePhoto from './modules/removePhoto'
import vehicleSearch from './modules/vehicleSearch'

typeAhead( document.querySelector('.search') )
removePhoto( document.querySelector('.logFormPhotosContainer') )
logDateFiller( document.querySelector('#logForm') )
vehicleSearch( document.querySelector('.lookupSwitcher') )
