import { FC } from 'react'
// import Link from 'next/link'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

const Navigator: FC = () => {
  const { connected, publicKey } = useWallet()

  function addressRedusor(address: string | undefined) {
    return address ? `${address.slice(0, 5)}...${address.slice(-5)}` : ''
  }

  return (
    <nav className="nav">
      <img className="nav__icon" src="logo.png" alt="eason-solana-swap-test" />
      <span className="nav__user">
        {connected && addressRedusor(publicKey?.toString())}
      </span>
      <WalletModalProvider>
        {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </WalletModalProvider>
    </nav>
  )
}

export default Navigator
