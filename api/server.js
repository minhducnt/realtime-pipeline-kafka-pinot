const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const PINOT_HOST = process.env.PINOT_HOST || 'localhost';
const PINOT_PORT = process.env.PINOT_PORT || 8099;
const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 2000; // 2 seconds

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store connected clients for SSE
let clients = [];

// Function to query Pinot
async function queryPinot(sql) {
    try {
        const response = await axios.post(`http://${PINOT_HOST}:${PINOT_PORT}/query/sql`, {
            sql: sql
        }, {
            timeout: 5000
        });

        return response.data;
    } catch (error) {
        console.error('Pinot query error:', error.message);
        return null;
    }
}

// Get real-time metrics
async function getRealTimeMetrics() {
    const queries = {
        summary: `
            SELECT
                COUNT(*) as total_transactions,
                SUM(CASE WHEN label = 1 THEN 1 ELSE 0 END) as fraud_transactions,
                ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
                SUM(deposit_amount) as total_amount
            FROM transactions
            WHERE create_dt >= ago('PT1H')
        `,
        recentActivity: `
            SELECT
                create_dt,
                user_seq,
                deposit_amount,
                receiving_country,
                payment_method,
                label
            FROM transactions
            ORDER BY create_dt DESC
            LIMIT 10
        `,
        timeSeries: `
            SELECT
                dateTrunc('minute', create_dt) as minute,
                COUNT(*) as transaction_count,
                SUM(CASE WHEN label = 1 THEN 1 ELSE 0 END) as fraud_count,
                ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate
            FROM transactions
            WHERE create_dt >= ago('PT1H')
            GROUP BY dateTrunc('minute', create_dt)
            ORDER BY minute DESC
            LIMIT 60
        `,
        geographic: `
            SELECT
                receiving_country,
                COUNT(*) as transaction_count,
                ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
                SUM(deposit_amount) as total_amount
            FROM transactions
            WHERE create_dt >= ago('PT1H')
            GROUP BY receiving_country
            ORDER BY transaction_count DESC
            LIMIT 15
        `,
        paymentMethods: `
            SELECT
                payment_method,
                COUNT(*) as transaction_count,
                ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
                SUM(deposit_amount) as total_amount
            FROM transactions
            WHERE create_dt >= ago('PT1H')
            GROUP BY payment_method
            ORDER BY transaction_count DESC
            LIMIT 10
        `,
        alerts: `
            SELECT
                create_dt,
                user_seq,
                deposit_amount,
                receiving_country,
                payment_method
            FROM transactions
            WHERE label = 1 AND create_dt >= ago('PT5M')
            ORDER BY create_dt DESC
            LIMIT 5
        `
    };

    const results = {};

    for (const [key, sql] of Object.entries(queries)) {
        const data = await queryPinot(sql);
        if (data && data.resultTable) {
            results[key] = data.resultTable.rows;
        } else {
            results[key] = [];
        }
    }

    return results;
}

// Server-Sent Events endpoint for real-time updates
app.get('/api/realtime', (req, res) => {
    // Set headers for SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Add client to list
    const clientId = Date.now();
    clients.push({ id: clientId, res });

    console.log(`Client ${clientId} connected. Total clients: ${clients.length}`);

    // Remove client on disconnect
    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
        console.log(`Client ${clientId} disconnected. Total clients: ${clients.length}`);
    });
});

// REST API endpoint for manual queries
app.post('/api/query', async (req, res) => {
    try {
        const { sql } = req.body;
        if (!sql) {
            return res.status(400).json({ error: 'SQL query required' });
        }

        const data = await queryPinot(sql);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Simple health check query
        const data = await queryPinot('SELECT 1');
        if (data) {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                pinot: 'connected',
                clients: clients.length
            });
        } else {
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                pinot: 'disconnected'
            });
        }
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// API-only server - dashboard served by Next.js
app.get('/', (req, res) => {
    res.json({
        message: 'Real-time Transaction Dashboard API Server',
        status: 'running',
        endpoints: {
            realtime: '/api/realtime',
            query: 'POST /api/query',
            health: '/api/health'
        }
    });
});

// Start real-time data broadcasting
function broadcastData() {
    getRealTimeMetrics().then(metrics => {
        const data = JSON.stringify({
            timestamp: new Date().toISOString(),
            metrics: metrics
        });

        // Send data to all connected clients
        clients.forEach(client => {
            client.res.write(`data: ${data}\n\n`);
        });

        console.log(`📊 Broadcasted real-time data to ${clients.length} clients`);
    }).catch(error => {
        console.error('Error broadcasting data:', error.message);
    });
}

// Start broadcasting every 2 seconds
setInterval(broadcastData, UPDATE_INTERVAL);

// Initial broadcast
setTimeout(broadcastData, 1000);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Real-time Transaction Dashboard Server running on port ${PORT}`);
    console.log(`📊 Broadcasting updates every ${UPDATE_INTERVAL}ms`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
    console.log(`🔗 Pinot connection: ${PINOT_HOST}:${PINOT_PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    clients.forEach(client => client.res.end());
    process.exit(0);
});
