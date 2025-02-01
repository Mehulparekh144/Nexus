import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

export default genAI
