import * as msw from 'msw'
import { handlers } from './handlers'

// Use namespace import to be resilient to ESM/CJS export differences
const { setupWorker } = msw

export const worker = setupWorker(...handlers)
