import { Feedback } from '../models/feedbackModel.js';

const FEEDBACK_CONFIG = {
  SORT_ORDER: { createdAt: -1 },
  PARSE_INT_RADIX: 10,
};

// ПУБЛІЧНИЙ МЕТОД GET (ОТРИМАННЯ ВІДГУКІВ)
export const getFeedbacks = async (req, res, next) => {
  try {
    const { locationId, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Фільтруємо за конкретною локацією, якщо фронтенд передав її ID
    if (locationId) {
      filter.locationId = locationId;
    }

    const currentPage = parseInt(page, FEEDBACK_CONFIG.PARSE_INT_RADIX);
    const currentLimit = parseInt(limit, FEEDBACK_CONFIG.PARSE_INT_RADIX);
    const skip = (currentPage - 1) * currentLimit;

    // Паралельне виконання запитів до бази даних для максимальної швидкодії
    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .sort(FEEDBACK_CONFIG.SORT_ORDER)
        .skip(skip)
        .limit(currentLimit)
        .populate({
          path: 'locationId',
          select: 'name region locationType',
        })
        .populate('owner', 'name avatar'),
      Feedback.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    // Відправляємо структуровану відповідь на фронтенд
    res.status(200).json({
      data: feedbacks,
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error); // Передаємо помилку далі у глобальний обробник команди
  }
};
