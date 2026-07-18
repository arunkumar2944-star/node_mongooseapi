const now = new Date();

const startOfCurrentWeek = new Date(now);
startOfCurrentWeek.setDate(
    now.getDate() - now.getDay()
);
startOfCurrentWeek.setHours(0, 0, 0, 0);

const endOfCurrentWeek = new Date(startOfCurrentWeek);
endOfCurrentWeek.setDate(
    startOfCurrentWeek.getDate() + 7
);


const startOfLastWeek = new Date(startOfCurrentWeek);
startOfLastWeek.setDate(
    startOfCurrentWeek.getDate() - 7
);

const endOfLastWeek = new Date(startOfCurrentWeek);


const currentWeekCount = await Note.countDocuments({
    createdBy: req.user._id,
    createdAt: {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek
    }
});

const previousWeekCount = await Note.countDocuments({
    createdBy: req.user._id,
    createdAt: {
        $gte: startOfLastWeek,
        $lt: endOfLastWeek
    }
});


let growth = 0;

if (previousWeekCount === 0) {
    growth = currentWeekCount > 0 ? 100 : 0;
} else {
    growth = (
        (currentWeekCount - previousWeekCount) /
        previousWeekCount
    ) * 100;
}

growth = Math.round(growth);

