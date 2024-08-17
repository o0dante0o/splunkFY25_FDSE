import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // Añadir esta línea

import layout from '@splunk/react-page';
import SearchComponent from '@splunk/search-component';
import ActionsComponent from '@splunk/actions-component';
import NavComponent from '@splunk/nav-component';
import App from './App';
import { GlobalProvider } from '@splunk/global-state';
import AppRoutes from './routes';

import { getUserTheme } from '@splunk/splunk-utils/themes';

import { StyledContainer, StyledGreeting } from './StartStyles';

getUserTheme()
    .then((theme) => {
        layout(
            <StyledContainer>
                <BrowserRouter>
                    <GlobalProvider>
                        <AppRoutes />
                    </GlobalProvider>
                </BrowserRouter>
            </StyledContainer>,
            {
                theme,
            }
        );
    })
    .catch((e) => {
        const errorEl = document.createElement('span');
        errorEl.innerHTML = e;
        document.body.appendChild(errorEl);
    });
