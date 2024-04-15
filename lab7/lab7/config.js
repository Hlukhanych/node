require('dotenv').config();

const config = {
    jwtSecret: process.env.JWT_SECRET || 'secret',
    enableScheduleJobs: process.env.ENABLE_SCHEDULE_JOBS || true,
};

module.exports = config;