import { Mangata } from '../src'

const uri = process.env.API_URL ? process.env.API_URL : 'wss://159.223.22.126:9946'
export const mangataInstance = Mangata.getInstance(uri)

export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME ? process.env.TEST_SUDO_NAME : ''
