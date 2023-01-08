import app from './app'
import { supabaseServer, supabase } from './db/init'
import { updatePaymentStatus } from './services/payment'
import { pgInstance } from './db/pg'
import { schedule, validate } from 'node-cron'
import 'dotenv/config'

app.listen(process.env.PORT, async () => {
  try {
    await pgInstance.connect().then((_) => {
      if (supabaseServer && supabase)
        console.log(`Running on port ${process.env.PORT}`)
      else console.log('client failed to connect')
    })
    const expression = process.env.EXPRESSION || '30 * * * * *'
    const task = schedule(expression, () => {
      updatePaymentStatus()
        .then(d => {
          console.log(d)
        }).catch(e => {
          console.error(e)
        })
    })
    if (validate(expression)) task.start()
  } catch (error) {
    throw new Error(`${error}`)
  }
})
