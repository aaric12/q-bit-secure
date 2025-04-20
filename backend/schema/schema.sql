-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for managing user sessions
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Security logs table for tracking security events
CREATE TABLE IF NOT EXISTS security_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  metadata JSONB
);

-- Simulation results table for storing quantum simulation data
CREATE TABLE IF NOT EXISTS simulation_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  protocol VARCHAR(50) NOT NULL,
  num_qubits INTEGER NOT NULL,
  key_generated TEXT,
  entropy FLOAT,
  qber FLOAT,
  execution_time FLOAT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  parameters JSONB
);

-- Analytics data table for storing analytics metrics
CREATE TABLE IF NOT EXISTS analytics_data (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  security_score INTEGER NOT NULL,
  encryption_strength INTEGER NOT NULL,
  threat_index INTEGER NOT NULL,
  key_exchanges INTEGER NOT NULL,
  active_connections INTEGER NOT NULL,
  data_transferred BIGINT NOT NULL,
  metadata JSONB
);

-- Dashboard metrics table for storing dashboard data
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  network_status VARCHAR(50) NOT NULL,
  active_connections INTEGER NOT NULL,
  data_transferred BIGINT NOT NULL,
  last_key_exchange TIMESTAMP WITH TIME ZONE,
  encryption_method VARCHAR(100) NOT NULL,
  key_length INTEGER NOT NULL,
  key_refresh_rate INTEGER NOT NULL,
  encryption_strength INTEGER NOT NULL,
  connectivity_score INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  packet_loss FLOAT NOT NULL,
  threat_detection_score INTEGER NOT NULL
);

-- Quantum keys table for storing generated quantum keys
CREATE TABLE IF NOT EXISTS quantum_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  key_data TEXT NOT NULL,
  protocol VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);
