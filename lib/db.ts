import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg'
import config from './config'

const pool = new Pool(config.database)

export async function query<T extends QueryResultRow = any>(
  textOrConfig: string | QueryConfig<any>,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now()
  try {
    const res = await pool.query<T>(textOrConfig, params)
    const duration = Date.now() - start
    console.log('Executed query', {
      text: typeof textOrConfig === 'string' ? textOrConfig : textOrConfig.text,
      duration,
      rows: res.rowCount
    })
    return res
  } catch (error) {
    console.error('Error executing query', {
      text: typeof textOrConfig === 'string' ? textOrConfig : textOrConfig.text,
      error
    })
    throw error
  }
}

interface ExtendedPoolClient extends Omit<PoolClient, 'query'> {
  lastQuery?: {
    text: string;
    params?: any[];
  };
  query<T extends QueryResultRow = any>(
    queryTextOrConfig: string | QueryConfig<any>,
    values?: any[]
  ): Promise<QueryResult<T>>;
}

export async function getClient(): Promise<ExtendedPoolClient> {
  const client = await pool.connect() as ExtendedPoolClient
  const query = client.query.bind(client)
  const release = client.release.bind(client)

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(`The last executed query on this client was:`, client.lastQuery)
  }, 5000)

  const wrappedQuery = async <T extends QueryResultRow = any>(
    textOrConfig: string | QueryConfig<any>,
    values?: any[]
  ): Promise<QueryResult<T>> => {
    client.lastQuery = {
      text: typeof textOrConfig === 'string' ? textOrConfig : textOrConfig.text,
      params: values || (typeof textOrConfig === 'object' ? textOrConfig.values : undefined)
    }
    if (typeof textOrConfig === 'string') {
      return query<T>(textOrConfig, values)
    }
    return query<T>(textOrConfig)
  }

  // Override the query method with our wrapped version
  client.query = wrappedQuery

  client.release = () => {
    clearTimeout(timeout)
    client.query = query
    client.release = release
    return release()
  }

  return client
}

// Gracefully close pool on application shutdown
process.on('SIGTERM', () => {
  pool.end().then(() => {
    console.log('Database pool has ended')
  })
})

export default {
  query,
  getClient,
  pool,
}
