import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Wallet from '../components/WalletProvider'
import Header from '../layouts/Header'

import 'normalize.css'
import '../styles/global.sass'
import '../styles/header.sass'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Wallet>
        <Header />
        <Component {...pageProps} />
      </Wallet>
    </ChakraProvider>
  )
}

export default MyApp
