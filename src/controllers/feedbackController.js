import { Feedback } from "../models/feedbackModel.js";
import { Location } from "../models/location.js";

const FEEDBACK_CONFIG = {
  SORT_ORDER: { createdAt: -1 },
  PARSE_INT_RADIX: 10,
};

export const getFeedbacks = async (req, res, next) => {
  try {
    const requestData = { ...req.query, ...req.body };
    const { locationId, page, limit } = requestData;

    const filter = {};
    if (locationId) {
      filter.locationId = locationId;
    }

    const currentPage = parseInt(page, FEEDBACK_CONFIG.PARSE_INT_RADIX) || 1;
    const currentLimit = parseInt(limit, FEEDBACK_CONFIG.PARSE_INT_RADIX) || 10;
    const skip = (currentPage - 1) * currentLimit;

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .sort(FEEDBACK_CONFIG.SORT_ORDER)
        .skip(skip)
        .limit(currentLimit)
        .populate({
          path: "locationId",
          select: "name region locationType",
        })
        .populate("owner", "name avatar"),
      Feedback.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    res.status(200).json({
      data: feedbacks,
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    const { locationId, userName, rate, description } = req.body;
    const owner = req.user?._id;

    const newFeedback = await Feedback.create({
      locationId,
      owner,
      userName,
      rate: Number(rate) || 0,
      description,
    });

    const allLocationFeedbacks = await Feedback.find({ locationId });

    if (allLocationFeedbacks.length > 0) {
      const sumRates = allLocationFeedbacks.reduce(
        (acc, item) => acc + (Number(item.rate) || 0),
        0,
      );
      const averageRate =
        Math.round((sumRates / allLocationFeedbacks.length) * 10) / 10;

      await Location.findByIdAndUpdate(locationId, {
        rate: averageRate,
      });
    }

    res.status(201).json({
      success: true,
      data: newFeedback,
    });
  } catch (error) {
    next(error);
  }
};
