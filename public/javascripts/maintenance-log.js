import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
import logDateFiller from './modules/logDateFiller'

// TODO - update search refs
typeAhead( $('.search') );

logDateFiller( $('#logForm') );
