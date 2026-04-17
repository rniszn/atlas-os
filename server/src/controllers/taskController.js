import mongoose from 'mongoose';
import { Task, PRIORITIES, STATUSES } from '../models/Task.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listTasks(req, res) {
  try {
    const tasks = await Task.find().sort({ updatedAt: -1 }).lean();
    return res.status(200).json(tasks);
  } catch (err) {
    console.error('[tasks] list', err);
    return res.status(500).json({ error: 'Failed to list tasks' });
  }
}

export async function getTask(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    const task = await Task.findById(id).lean();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (err) {
    console.error('[tasks] get', err);
    return res.status(500).json({ error: 'Failed to get task' });
  }
}

export async function createTask(req, res) {
  try {
    const { title, priority, status, tags } = req.body;

    if (title === undefined || title === null) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ error: 'title must be a string with min length 3' });
    }

    if (priority !== undefined && !PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `priority must be one of: ${PRIORITIES.join(', ')}` });
    }
    if (status !== undefined && !STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
    }
    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags must be an array of strings' });
    }

    const task = await Task.create({
      title: title.trim(),
      priority: priority ?? 'Medium',
      status: status ?? 'Pending',
      tags: Array.isArray(tags) ? tags.map(String) : [],
    });
    return res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[tasks] create', err);
    return res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const { title, priority, status, tags } = req.body;
    const patch = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ error: 'title must be a string with min length 3' });
      }
      patch.title = title.trim();
    }
    if (priority !== undefined) {
      if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: `priority must be one of: ${PRIORITIES.join(', ')}` });
      }
      patch.priority = priority;
    }
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
      }
      patch.status = status;
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'tags must be an array of strings' });
      }
      patch.tags = tags.map(String);
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const task = await Task.findByIdAndUpdate(
      id, 
      patch, 
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[tasks] update', err);
    return res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted', id });
  } catch (err) {
    console.error('[tasks] delete', err);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
}
