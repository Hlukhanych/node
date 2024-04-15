const config = require('../config');
const startHeartBeatJob = require('./heartbeat.job');
const startUserLoginReminderJob = require('./userLoginReminder.job');

function start() {
    if (!config.enableScheduleJobs) {
        console.warn('Jobs scheduling is not enabled.');
        return;
    }

    startHeartBeatJob();
    startUserLoginReminderJob();
}

module.exports = start;