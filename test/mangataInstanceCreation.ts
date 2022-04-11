import { Mangata } from '../src'

const uri = process.env.API_URL ? process.env.API_URL : 'ws://127.0.0.1:9988'
export const mangataInstance = Mangata.getInstance(uri)

export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME ? process.env.TEST_SUDO_NAME : ''
