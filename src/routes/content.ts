import {Router, Request, Response } from 'express';
import Content from '../model/content';
import Tag from '../model/tag';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
  };
}

const getContentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const contents = await Content.find({ userId }).populate([{path: 'tags'}, {path: 'userId', select:'username'}]);
    res.status(200).json({ contents });
    return;
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

router.get('/', authenticateJWT, getContentHandler);

const postContentHandler= async(req:AuthRequest, res:Response) => {
    try{
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const {link, title, tags=[], type} = req.body;
        if (!link || !title || !type) {
            res.status(400).json({ message: 'Link, title, and type are required' });
            return;
        }
        const tagNames= tags.map((tag: string) => tag.trim().toLowerCase()).filter((tag: string) => tag !== '');
        const existingTags= await Tag.find({title: { $in: tagNames } });
        const existingTagNames = existingTags.map((tag: any) => tag.title.toLowerCase());
        const existingTagIds = existingTags.map((tag: any) => tag._id);
        const newTagNames = tagNames.filter((name:string) => !existingTagNames.includes(name));

        const newTags= await Tag.insertMany(
            newTagNames.map((name: string) => ({ title: name }))
        );

        const allTags = [...existingTagIds, ...newTags.map((tag: any) => tag._id)];

        const content = await Content.create({
            link,
            type,
            title,
            tags: allTags,
            userId
        });
        res.status(201).json({ message: 'Content created successfully', content });
        return;
    }catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

router.post('/', authenticateJWT,  postContentHandler);

const deleteContentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const contentId = req.params.id;

    if (!userId || !contentId) {
      res.status(400).json({ message: 'Content ID is required' });
      return;
    }

    const content = await Content.findOneAndDelete({ _id: contentId, userId });

    if (!content) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }

    res.status(200).json({ message: 'Content deleted successfully' });
    return;
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

router.delete('/:id', authenticateJWT, deleteContentHandler);

export default router;


