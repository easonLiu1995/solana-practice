import { FC } from 'react'
import '@chakra-ui/alert'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  AlertStatus,
  Link
} from '@chakra-ui/react'

import style from '../styles/module/notify.module.sass'

export interface INotifyProps {
  status: AlertStatus
  title: string
  tx?: string
}

interface NotifyProps {
  msg: {
    status: AlertStatus
    title: string
    tx?: string
  }
}

const Notify: FC<NotifyProps> = ({ msg }) => {
  return (
    <Alert
      status={msg.status}
      bottom="5%"
      left="0"
      w="auto"
      pos="fixed"
      maxWidth={'75%'}
      pr={10}
      className={style.notify}
    >
      <AlertIcon />
      <AlertTitle className={style['notify-msg']}>{msg.title}</AlertTitle>
      {msg.tx && (
        <Link
          color={'blue.600'}
          target="_blank"
          href={'https://solscan.io/tx/' + msg.tx}
        >
          See transaction
        </Link>
      )}
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  )
}

export default Notify
