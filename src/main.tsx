// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'nprogress/nprogress.css'
import App from './App.tsx'
import {PersistGate} from "redux-persist/integration/react"
import {Provider} from "react-redux"
import {persistor, store} from "./redux/store.ts"
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider
          toastOptions={{defaultOptions: { position: 'top-right', duration: 3000, isClosable: true } }}
        >
          <App />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  // </StrictMode>,
)
