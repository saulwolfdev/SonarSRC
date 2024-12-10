import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { esES } from "@mui/x-date-pickers/locales";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import 'dayjs/locale/es';

moment.locale('es');

const LocalizationProviderCustom = ({ children } : any) => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
        >
            {children}
        </LocalizationProvider>
    )
}

export default LocalizationProviderCustom
