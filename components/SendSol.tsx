import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
import React, { FC, useCallback, useEffect, useState, useRef } from 'react'
import BigNumber from 'bignumber.js'

import {
  Container,
  Button,
  Input,
  Flex,
  VStack,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  InputGroup,
  AlertStatus
} from '@chakra-ui/react'

import { SOL } from '../utils/unit'
import { numberInput } from '../utils/formatter'

import Notify, { INotifyProps } from './Notify'

const SendOneLamportToRandomAddress: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()
  const inputRef = useRef(null)
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState('')
  const [address, setAddress] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [notifyData, setnotifyData] = useState<INotifyProps>({
    title: '',
    status: 'info'
  })

  useEffect(() => {
    if (connected) {
      getUserBalance()
    } else {
      setBalance('')
    }
  }, [connected])

  const getUserBalance = useCallback(async () => {
    const userBalance = await connection.getBalance(publicKey!, 'processed')
    console.log(userBalance)
    const formatUserBalance = new BigNumber(userBalance)
      .dividedBy(SOL)
      .toString()
    setBalance(formatUserBalance)
  }, [publicKey])

  const sendSOL = async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(address),
        lamports: new BigNumber(amount).multipliedBy(SOL).toNumber()
      })
    )

    let signature = null

    try {
      signature = await sendTransaction(transaction, connection)
      setIsShowNotify(true)
      setnotifyData({
        status: 'success',
        title: 'transition send.',
        tx: signature
      })
      setTimeout(() => {
        setIsShowNotify(false)
      }, 5000)
      const res = await connection.confirmTransaction(signature, 'processed')
      setIsPending(false)
    } catch (e: Error) {
      setIsPending(false)
      setnotifyData({
        status: 'error',
        title: e?.message
      })
      setIsShowNotify(true)
      setTimeout(() => {
        setIsShowNotify(false)
      }, 5000)
    }
  }
  return (
    <Container maxW={500} mt={20}>
      {isShowNotify && <Notify msg={notifyData} />}
      <VStack spacing={4} direction="row" align="center">
        <FormControl isRequired>
          <FormLabel htmlFor="address-input">Address</FormLabel>
          <Input
            id="address-input"
            placeholder="Address"
            onChange={(e) => {
              setAddress(e.target.value)
            }}
            value={address}
          />
        </FormControl>
        <Flex alignItems={'center'} w={'100%'}>
          <FormControl isRequired>
            <FormLabel htmlFor="amount-input">Amount</FormLabel>
            <InputGroup>
              <Input
                ref={inputRef}
                placeholder={balance ? `max: ${balance}` : 'amount'}
                w={'100%'}
                onInput={(e) => {
                  e.currentTarget.value = numberInput(e.currentTarget.value)
                  if (e.currentTarget.value > balance) {
                    e.currentTarget.value = balance
                  }
                  setAmount(e.currentTarget.value)
                }}
              />
              <Button
                colorScheme="blue"
                variant="outline"
                size="md"
                ml={2}
                onClick={() => {
                  inputRef.current.value = new BigNumber(balance)
                    .dividedBy(2)
                    .toString()
                }}
              >
                50%
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                size="md"
                ml={2}
                disabled={new BigNumber(balance).toNumber() < 0.05}
                onClick={() => {
                  inputRef.current.value = new BigNumber(balance)
                    .minus(0.05)
                    .toString()
                }}
              >
                Max
              </Button>
            </InputGroup>
            {parseFloat(balance) < 0.05 && (
              <FormHelperText color={'red.400'}>
                Recommend at least 0.05 SOL for transaction
              </FormHelperText>
            )}
          </FormControl>
        </Flex>
        <Stack mt={2} w={'100%'}>
          <Button
            onClick={() => {
              sendSOL()
              setIsPending(true)
            }}
            disabled={!publicKey || isPending}
            isLoading={isPending}
            colorScheme="blue"
            size="md"
            w={'100%'}
            mt={5}
          >
            {<span>send</span>}
          </Button>
        </Stack>
      </VStack>
    </Container>
  )
}

export default SendOneLamportToRandomAddress
