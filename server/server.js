const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_report')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  building: String,
  room: String,
  status: { type: String, default: 'reported' },
  priority: { type: String, default: 'Medium' },
  reportedBy: String,
  reportedAt: { type: Date, default: Date.now },
  assignedTo: String,
  resolvedAt: Date,
  images: [String]
});

const Issue = mongoose.model('Issue', issueSchema);

// Fallback issues logic (used if needed)
let fallbackIssues = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'No power in Room 201',
    description: 'Complete power outage in classroom 201. No lights or AC working.',
    category: 'power',
    location: 'Academic Block A, Floor 2',
    building: 'Academic Block A',
    room: '201',
    status: 'in_progress',
    priority: 'Urgent',
    reportedBy: 'Rahul Sharma',
    reportedAt: new Date().toISOString(),
    assignedTo: 'Electrical Team'
  }
];

// Test Routes
app.get('/api/test', (req, res) => {
  res.json({ message: "API working", status: "online" });
});

app.get('/', (req, res) => {
  res.send('Backend running');
});

// Routes
app.get('/api/issues', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(fallbackIssues);
    }
    const issues = await Issue.find().sort({ reportedAt: -1 });
    res.json(issues);
  } catch (err) {
    res.json(fallbackIssues);
  }
});

app.post('/api/issues', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('Database not connected. Saving to in-memory fallback.');
      const newIssue = { 
        _id: Date.now().toString(), 
        ...req.body, 
        reportedAt: new Date().toISOString(),
        status: 'reported'
      };
      fallbackIssues.unshift(newIssue);
      return res.status(201).json(newIssue);
    }
    const newIssue = new Issue(req.body);
    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/issues/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/issues/:id', async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       throw new Error('Database not connected');
    }
    const issues = await Issue.find();
    const total = issues.length;
    const reported = issues.filter(i => i.status === 'reported').length;
    const inProgress = issues.filter(i => i.status === 'in_progress').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;

    const byCategory = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total,
      reported,
      inProgress,
      resolved,
      byCategory,
      avgResolutionTime: '4.2 hours'
    });
  } catch (err) {
    res.json({
      total: 0,
      reported: 0,
      inProgress: 0,
      resolved: 0,
      byCategory: {},
      avgResolutionTime: '0 hours'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server (In-Memory Fallback) is running on port ${PORT}`);
});

