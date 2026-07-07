import { Router } from 'express';
import {
  listTracks,
  getTrack,
  createTrack,
  updateTrack,
  addSkill,
  updateSkill,
  deleteSkill,
  deleteTrack,
} from '../controllers/trackController.js';

const router = Router();

router.get('/', listTracks);
router.post('/', createTrack);
router.post('/:id/skills', addSkill);
router.patch('/:id/skills/:skillId', updateSkill);
router.delete('/:id/skills/:skillId', deleteSkill);
router.get('/:id', getTrack);
router.patch('/:id', updateTrack);
router.delete('/:id', deleteTrack);

export default router;
