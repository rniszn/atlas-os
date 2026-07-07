import mongoose from 'mongoose';
import { Track } from '../models/Track.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function listTracks(req, res) {
  try {
    const tracks = await Track.find().sort({ createdAt: 1 }).lean();
    return res.status(200).json(tracks);
  } catch (err) {
    console.error('[tracks] list', err);
    return res.status(500).json({ error: 'Failed to list tracks' });
  }
}

export async function getTrack(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid track id' });
    }
    const track = await Track.findById(id).lean();
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    return res.status(200).json(track);
  } catch (err) {
    console.error('[tracks] get', err);
    return res.status(500).json({ error: 'Failed to get track' });
  }
}

export async function createTrack(req, res) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    const track = await Track.create({ name: name.trim() });
    return res.status(201).json(track);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[tracks] create', err);
    return res.status(500).json({ error: 'Failed to create track' });
  }
}

export async function updateTrack(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid track id' });
    }

    const { name } = req.body;
    const patch = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
      }
      patch.name = name.trim();
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const track = await Track.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    return res.status(200).json(track);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[tracks] update', err);
    return res.status(500).json({ error: 'Failed to update track' });
  }
}

export async function addSkill(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid track id' });
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    track.skills.push({ name: name.trim() });
    await track.save();
    return res.status(200).json(track);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[tracks] addSkill', err);
    return res.status(500).json({ error: 'Failed to add skill' });
  }
}

export async function updateSkill(req, res) {
  try {
    const { id, skillId } = req.params;
    if (!isValidObjectId(id) || !isValidObjectId(skillId)) {
      return res.status(400).json({ error: 'Invalid track or skill id' });
    }

    const { isCompleted } = req.body;
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const skill = track.skills.id(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (isCompleted !== undefined) {
      skill.isCompleted = Boolean(isCompleted);
    } else {
      skill.isCompleted = !skill.isCompleted;
    }

    await track.save();
    return res.status(200).json(track);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ error: messages.join('; ') || 'Validation failed' });
    }
    console.error('[tracks] updateSkill', err);
    return res.status(500).json({ error: 'Failed to update skill' });
  }
}

export async function deleteSkill(req, res) {
  try {
    const { id, skillId } = req.params;
    if (!isValidObjectId(id) || !isValidObjectId(skillId)) {
      return res.status(400).json({ error: 'Invalid track or skill id' });
    }

    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const skill = track.skills.id(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    skill.deleteOne();
    await track.save();
    return res.status(200).json(track);
  } catch (err) {
    console.error('[tracks] deleteSkill', err);
    return res.status(500).json({ error: 'Failed to delete skill' });
  }
}

export async function deleteTrack(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid track id' });
    }

    const track = await Track.findByIdAndDelete(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    return res.status(200).json({ message: 'Track deleted', id });
  } catch (err) {
    console.error('[tracks] delete', err);
    return res.status(500).json({ error: 'Failed to delete track' });
  }
}
