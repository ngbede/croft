import { Pool, PoolClient, QueryResult } from 'pg'
import { params } from './pg-client'

export class Pg {
  params: object // connection params
  _pool: Pool

  constructor(params: object) {
    this.params = params
  }

  connect(): Promise<PoolClient> {
    this._pool = new Pool(this.params)
    return this._pool.connect()
  }

  disconnect(): Promise<void> {
    return this._pool.end()
  }

  async query(queryString: string, queryParams: Array<String>) {
    try {
      const q: QueryResult = await this._pool.query(queryString, queryParams)
      return q
    } catch (e: any) {
      throw new Error(`${e}`)
    }
  }
}

// create new instance
export const pgInstance = new Pg(params)
