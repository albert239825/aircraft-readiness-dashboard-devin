const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ============================================================================
// DETERMINISTIC SEED DATA (Synthetic demo data only)
// ============================================================================

const bases = [
  'Travis AFB (demo)',
  'Dover AFB (demo)',
  'McGuire AFB (demo)',
  'Charleston AFB (demo)',
  'Hickam AFB (demo)'
];

const aircraftTypes = ['C-17', 'C-130', 'F-16', 'F-22', 'KC-135', 'B-52'];
const statuses = ['MISSION CAPABLE', 'NON-MISSION CAPABLE'];

// Generate deterministic aircraft data
const aircraft = [];
for (let i = 1; i <= 20; i++) {
  const tailNumber = `DEMO-${String(i).padStart(3, '0')}`;
  aircraft.push({
    id: i,
    tailNumber,
    aircraftType: aircraftTypes[(i - 1) % aircraftTypes.length],
    base: bases[(i - 1) % bases.length],
    status: i % 4 === 0 ? 'NON-MISSION CAPABLE' : 'MISSION CAPABLE',
    nextInspectionDate: new Date(2026, (i % 12), (i % 28) + 1).toISOString().split('T')[0]
  });
}

// Priority and status enums for work orders
const priorities = ['LOW', 'MED', 'HIGH'];
const workOrderStatuses = ['Draft', 'Submitted', 'Approved'];

// Generate deterministic work orders
let workOrderIdCounter = 100;
const workOrders = [];
for (let i = 0; i < 10; i++) {
  workOrders.push({
    id: workOrderIdCounter++,
    workOrderId: `WO-${String(100 + i).padStart(4, '0')}`,
    tailNumber: aircraft[i % aircraft.length].tailNumber,
    title: `Inspection Task ${i + 1}`,
    description: `Scheduled maintenance task for aircraft ${aircraft[i % aircraft.length].tailNumber}`,
    priority: priorities[i % priorities.length],
    status: workOrderStatuses[i % workOrderStatuses.length],
    createdAt: new Date(2026, 0, i + 1).toISOString()
  });
}

// ============================================================================
// AUTH MIDDLEWARE
// ============================================================================

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  
  // Simple validation - just check token exists and is non-empty
  const token = authHeader.split(' ')[1];
  if (!token || token.length === 0) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  
  // Decode the base64 token to extract user info (for demo purposes)
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    req.user = decoded;
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: Malformed token' });
  }
  
  next();
}

// Apply auth middleware to all /api/* routes
app.use('/api', authMiddleware);

// ============================================================================
// API ROUTES
// ============================================================================

// GET /api/aircraft - List all aircraft
app.get('/api/aircraft', (req, res) => {
  res.json(aircraft);
});

// GET /api/aircraft/:id - Get aircraft by tailNumber or id
app.get('/api/aircraft/:id', (req, res) => {
  const { id } = req.params;
  
  // Try to find by tailNumber first, then by numeric id
  let found = aircraft.find(a => a.tailNumber === id);
  if (!found) {
    const numId = parseInt(id, 10);
    found = aircraft.find(a => a.id === numId);
  }
  
  if (!found) {
    return res.status(404).json({ error: 'Aircraft not found' });
  }
  
  // Include work orders for this aircraft
  const aircraftWorkOrders = workOrders.filter(wo => wo.tailNumber === found.tailNumber);
  
  res.json({
    ...found,
    workOrders: aircraftWorkOrders
  });
});

// GET /api/work-orders - List all work orders
app.get('/api/work-orders', (req, res) => {
  res.json(workOrders);
});

// POST /api/work-orders - Create new work order
app.post('/api/work-orders', (req, res) => {
  const { tailNumber, title, description, priority, status } = req.body;
  
  // Validate required fields
  if (!tailNumber || !title) {
    return res.status(400).json({ error: 'tailNumber and title are required' });
  }
  
  // Validate tailNumber exists
  const aircraftExists = aircraft.find(a => a.tailNumber === tailNumber);
  if (!aircraftExists) {
    return res.status(400).json({ error: 'Invalid tailNumber' });
  }
  
  const newWorkOrder = {
    id: workOrderIdCounter++,
    workOrderId: `WO-${String(workOrderIdCounter).padStart(4, '0')}`,
    tailNumber,
    title,
    description: description || '',
    priority: priority || 'LOW',
    status: status || 'Draft',
    createdAt: new Date().toISOString()
  };
  
  workOrders.push(newWorkOrder);
  res.status(201).json(newWorkOrder);
});

// PUT /api/work-orders/:id - Update work order
app.put('/api/work-orders/:id', (req, res) => {
  const { id } = req.params;
  const numId = parseInt(id, 10);
  
  const index = workOrders.findIndex(wo => wo.id === numId);
  if (index === -1) {
    return res.status(404).json({ error: 'Work order not found' });
  }
  
  const { tailNumber, title, description, priority, status } = req.body;
  
  // Validate tailNumber if provided
  if (tailNumber) {
    const aircraftExists = aircraft.find(a => a.tailNumber === tailNumber);
    if (!aircraftExists) {
      return res.status(400).json({ error: 'Invalid tailNumber' });
    }
    workOrders[index].tailNumber = tailNumber;
  }
  
  if (title !== undefined) workOrders[index].title = title;
  if (description !== undefined) workOrders[index].description = description;
  if (priority !== undefined) workOrders[index].priority = priority;
  if (status !== undefined) workOrders[index].status = status;
  
  res.json(workOrders[index]);
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`Air Fleet Backend running on http://localhost:${PORT}`);
  console.log(`Loaded ${aircraft.length} aircraft and ${workOrders.length} work orders`);
});
