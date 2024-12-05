// import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import 'nprogress/nprogress.css'
import App from './App.tsx'
import {PersistGate} from "redux-persist/integration/react"
import {Provider} from "react-redux"
import {persistor, store} from "./redux/store.ts"
import {ChakraProvider, extendTheme} from '@chakra-ui/react'

const customTheme = extendTheme({
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: "teal.600",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "teal.600",
      }
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "teal.600",
      }
    },
    NumberInput: {
      defaultProps: {
        focusBorderColor: "teal.600",
      }
    }
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChakraProvider theme={customTheme}
        toastOptions={{defaultOptions: {position: 'bottom-right', duration: 3000, isClosable: true}}}
      >
        <App/>
      </ChakraProvider>
    </PersistGate>
  </Provider>
  // </StrictMode>,
)
