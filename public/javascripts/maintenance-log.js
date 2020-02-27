import '../sass/style.scss'

import { $, $$ } from './modules/bling'
import typeAhead from './modules/typeAhead'
import logDateFiller from './modules/logDateFiller'
import removePhoto from './modules/removePhoto'
import vehicleSearch from './modules/vehicleSearch'

typeAhead( $('.search') )
removePhoto( $('.logFormPhotosContainer') )
logDateFiller( $('#logForm') )
vehicleSearch( $('.lookupSwitcher') )