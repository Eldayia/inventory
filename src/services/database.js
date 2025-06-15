import { createClient } from '@supabase/supabase-js'

// Conditionally import pg only when needed
let pg = null
if (typeof window === 'undefined' && import.meta.env.VITE_DB_TYPE === 'postgresql') {
  pg = await import('pg')
}

class DatabaseService {
  constructor() {
    this.dbType = import.meta.env.VITE_DB_TYPE || 'supabase'
    
    if (this.dbType === 'supabase') {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      this.client = createClient(supabaseUrl, supabaseKey)
    } else if (this.dbType === 'postgresql') {
      if (!pg) {
        throw new Error('PostgreSQL non disponible dans l\'environnement navigateur')
      }
      this.client = new pg.Pool({
        host: import.meta.env.VITE_PG_HOST,
        port: import.meta.env.VITE_PG_PORT,
        database: import.meta.env.VITE_PG_DATABASE,
        user: import.meta.env.VITE_PG_USER,
        password: import.meta.env.VITE_PG_PASSWORD,
        ssl: import.meta.env.VITE_PG_SSL === 'true',
        timezone: import.meta.env.VITE_PG_TIMEZONE
      })
    } else {
      throw new Error('Type de base de données non supporté')
    }
  }

  async query(table, operation, params = {}) {
    if (this.dbType === 'supabase') {
      return this._supabaseQuery(table, operation, params)
    } else if (this.dbType === 'postgresql') {
      return this._postgresQuery(table, operation, params)
    }
  }

  async _supabaseQuery(table, operation, params) {
    let query = this.client.from(table)

    switch (operation) {
      case 'select':
        if (params.count) {
          query = query.select(params.select || '*', { count: params.count })
        } else {
          query = query.select(params.select || '*')
        }
        if (params.where) {
          Object.entries(params.where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        if (params.order) {
          query = query.order(params.order.column, params.order.options)
        }
        if (params.single) {
          query = query.single()
        }
        break

      case 'insert':
        query = query.insert(params.data).select()
        if (params.single) {
          query = query.single()
        }
        break

      case 'update':
        query = query.update(params.data)
        if (params.where) {
          Object.entries(params.where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        if (params.select) {
          query = query.select(params.select)
        }
        if (params.single) {
          query = query.single()
        }
        break

      case 'delete':
        if (params.where) {
          Object.entries(params.where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        break

      default:
        throw new Error('Opération non supportée')
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  async _postgresQuery(table, operation, params) {
    let query = ''
    let values = []
    let index = 1

    switch (operation) {
      case 'select':
        query = `SELECT ${params.select || '*'} FROM ${table}`
        if (params.where) {
          const whereConditions = Object.entries(params.where).map(([key, value]) => {
            values.push(value)
            return `${key} = $${index++}`
          }).join(' AND ')
          query += ` WHERE ${whereConditions}`
        }
        if (params.order) {
          query += ` ORDER BY ${params.order.column} ${params.order.options.ascending ? 'ASC' : 'DESC'}`
        }
        if (params.single) {
          query += ' LIMIT 1'
        }
        break

      case 'insert':
        const columns = Object.keys(params.data).join(', ')
        const placeholders = Object.keys(params.data).map(() => `$${index++}`).join(', ')
        values = Object.values(params.data)
        query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`
        break

      case 'update':
        const setValues = Object.entries(params.data).map(([key, value]) => {
          values.push(value)
          return `${key} = $${index++}`
        }).join(', ')
        query = `UPDATE ${table} SET ${setValues}`
        if (params.where) {
          const whereConditions = Object.entries(params.where).map(([key, value]) => {
            values.push(value)
            return `${key} = $${index++}`
          }).join(' AND ')
          query += ` WHERE ${whereConditions}`
        }
        query += ' RETURNING *'
        break

      case 'delete':
        query = `DELETE FROM ${table}`
        if (params.where) {
          const whereConditions = Object.entries(params.where).map(([key, value]) => {
            values.push(value)
            return `${key} = $${index++}`
          }).join(' AND ')
          query += ` WHERE ${whereConditions}`
        }
        break

      default:
        throw new Error('Opération non supportée')
    }

    const result = await this.client.query(query, values)
    return params.single ? result.rows[0] : result.rows
  }
}

const db = new DatabaseService()
export default db