import mongoose from 'mongoose';
import { Job, STATUSES } from '../models/Job.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listJobs(req, res) {
  try {
    const jobs = await Job.find().sort({ appliedDate: -1 }).lean();
    return res.status(200).json(jobs);
  } catch (err) {
    console.error('[jobs] list', err);
    return res.status(500).json({ error: 'Failed to list jobs' });
  }
}

export async function getJob(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }
    const job = await Job.findById(id).lean();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    return res.status(200).json(job);
  } catch (err) {
    console.error('[jobs] get', err);
    return res.status(500).json({ error: 'Failed to get job' });
  }
}

export async function createJob(req, res) {
  try {
    const { role, company, location, status, appliedDate } = req.body;

    if (!role || typeof role !== 'string' || !role.trim()) {
      return res.status(400).json({ error: 'role is required' });
    }
    if (!company || typeof company !== 'string' || !company.trim()) {
      return res.status(400).json({ error: 'company is required' });
    }
    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ error: 'location is required' });
    }
    if (status !== undefined && !STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
    }

    const job = await Job.create({
      role: role.trim(),
      company: company.trim(),
      location: location.trim(),
      status: status ?? 'Applied',
      appliedDate: appliedDate ? new Date(appliedDate) : undefined,
    });
    return res.status(201).json(job);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[jobs] create', err);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

export async function updateJob(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }

    const { role, company, location, status, appliedDate } = req.body;
    const patch = {};

    if (role !== undefined) {
      if (typeof role !== 'string' || !role.trim()) {
        return res.status(400).json({ error: 'role must be a non-empty string' });
      }
      patch.role = role.trim();
    }
    if (company !== undefined) {
      if (typeof company !== 'string' || !company.trim()) {
        return res.status(400).json({ error: 'company must be a non-empty string' });
      }
      patch.company = company.trim();
    }
    if (location !== undefined) {
      if (typeof location !== 'string' || !location.trim()) {
        return res.status(400).json({ error: 'location must be a non-empty string' });
      }
      patch.location = location.trim();
    }
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
      }
      patch.status = status;
    }
    if (appliedDate !== undefined) {
      patch.appliedDate = new Date(appliedDate);
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const job = await Job.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    return res.status(200).json(job);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[jobs] update', err);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}

export async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    return res.status(200).json({ message: 'Job deleted', id });
  } catch (err) {
    console.error('[jobs] delete', err);
    return res.status(500).json({ error: 'Failed to delete job' });
  }
}
