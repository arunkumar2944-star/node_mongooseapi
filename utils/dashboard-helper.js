const mongoose = require('mongoose');
const Note = require('../models/note');

/**
 * Calculate growth percentage
 */
const calculateGrowth = (current, previous) => {

    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }

    return Number(
        (((current - previous) / previous) * 100).toFixed(2)
    );
};

/**
 * Get current and previous week range
 */
const getWeekRange = () => {

    const now = new Date();

    const day = now.getDay();

    const diff = day === 0 ? 6 : day - 1;

    const currentWeekStart = new Date(now);

    currentWeekStart.setDate(
        now.getDate() - diff
    );

    currentWeekStart.setHours(
        0,
        0,
        0,
        0
    );

    const currentWeekEnd = new Date(
        currentWeekStart
    );

    currentWeekEnd.setDate(
        currentWeekStart.getDate() + 6
    );

    currentWeekEnd.setHours(
        23,
        59,
        59,
        999
    );

    const previousWeekStart = new Date(
        currentWeekStart
    );

    previousWeekStart.setDate(
        currentWeekStart.getDate() - 7
    );

    const previousWeekEnd = new Date(
        currentWeekStart
    );

    previousWeekEnd.setMilliseconds(-1);

    return {
        currentWeekStart,
        currentWeekEnd,
        previousWeekStart,
        previousWeekEnd
    };
};

/**
 * Count notes
 */
const getCount = async (
    userId,
    extraFilter = {},
    startDate,
    endDate
) => {

    return await Note.countDocuments({

        createdBy: new mongoose.Types.ObjectId(userId),

        isActive: true,

        ...extraFilter,

        createdAt: {
            $gte:  new Date(startDate),
            $lte:  new Date(endDate)
        }
    });
};

module.exports = {
    calculateGrowth,
    getWeekRange,
    getCount
};