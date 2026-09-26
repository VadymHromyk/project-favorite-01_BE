import { Feedback } from '../models/feedbackModel.js';

export const createFeedback = async (req, res, next) => {
  try {
    const { locationId, userName, rate, description } = req.body;
    
    const owner = req.user?._id; 

    const newFeedback = await Feedback.create({
      locationId,
      owner,
      userName,
      rate,
      description,
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      data: newFeedback
    });
  } catch (error) {
    next(error);
  }
};
