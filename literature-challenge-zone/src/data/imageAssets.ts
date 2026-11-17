import exhibitionVignette from '@/src/assets/images/exhibition_literary_vignette_1794508049502.jpg';
import glassSlipperImg from '@/src/assets/images/clue_glass_slipper_1794508050015.jpg';
import woodenPuppetImg from '@/src/assets/images/clue_wooden_puppet_1794508050745.jpg';
import ravenStudyImg from '@/src/assets/images/clue_raven_study_1794508050706.jpg';
import type { PictureImageKey } from '../types/challenges.ts';

export const EXHIBITION_VIGNETTE_URL = exhibitionVignette;

export const PICTURE_IMAGE_ASSETS: Record<PictureImageKey, string> = {
  glass_slipper: glassSlipperImg,
  wooden_puppet: woodenPuppetImg,
  raven_study: ravenStudyImg,
};
