import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_DATABASE

let client
let db

async function connectToDatabase() {
    if (db) return db

    try {
        client = new MongoClient(uri)
        await client.connect()
        console.log('Connected successfully to MongoDB server')
        db = client.db(dbName)
        return db
    } catch (error) {
        console.error('MongoDB connection error:', error)
        throw error
    }
}

// Close the connection when the application terminates
process.on('SIGINT', async () => {
    if (client) {
        await client.close()
        console.log('MongoDB connection closed')
        process.exit(0)
    }
})

export { connectToDatabase }
