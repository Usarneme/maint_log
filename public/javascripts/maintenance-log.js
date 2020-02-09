import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
import logDateFiller from './modules/logDateFiller'

typeAhead( $('.search') );

logDateFiller( $('#logForm') );
