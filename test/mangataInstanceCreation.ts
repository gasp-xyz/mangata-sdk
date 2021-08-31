import { Mangata } from '../src'

const uri = process.env.API_URL ? process.env.API_URL : 'ws://127.0.0.1:9944'
export const mangataInstance = Mangata.getInstance(uri)
