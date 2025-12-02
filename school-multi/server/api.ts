import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Test database connection endpoint
app.post('/api/test-db-connection', async (req, res) => {
    const { mode, host, database, user, password, port, connectionString } = req.body;

    let pool: Pool | null = null;

    try {
        // Create connection pool based on mode
        if (mode === 'simple') {
            if (!host || !database || !user || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: host, database, user, password'
                });
            }

            pool = new Pool({
                host,
                database,
                user,
                password,
                port: port || 5432,
                connectionTimeoutMillis: 5000, // 5 second timeout
            });
        } else if (mode === 'advanced') {
            if (!connectionString) {
                return res.status(400).json({
                    success: false,
                    error: 'Connection string is required'
                });
            }

            pool = new Pool({
                connectionString,
                connectionTimeoutMillis: 5000,
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid mode. Must be "simple" or "advanced"'
            });
        }

        // Test the connection
        const client = await pool.connect();

        // Run a simple query to verify connection
        const result = await client.query('SELECT current_database(), current_user');

        client.release();
        await pool.end();

        // Return success with connection details
        res.json({
            success: true,
            host: mode === 'simple' ? host : result.rows[0].current_database,
            database: result.rows[0].current_database,
            user: result.rows[0].current_user
        });

    } catch (error: any) {
        // Close pool if it was created
        if (pool) {
            try {
                await pool.end();
            } catch (e) {
                // Ignore cleanup errors
            }
        }

        // Return detailed error message
        let errorMessage = 'Connection failed';

        if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Connection refused. Please check if PostgreSQL server is running and accessible.';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'Host not found. Please check the hostname.';
        } else if (error.code === '28P01') {
            errorMessage = 'Authentication failed. Please check your username and password.';
        } else if (error.code === '3D000') {
            errorMessage = 'Database does not exist. Please check the database name.';
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Connection timeout. Please check your network and firewall settings.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(400).json({
            success: false,
            error: errorMessage,
            code: error.code
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Database test API server running on http://localhost:${PORT}`);
    console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/test-db-connection`);
});
