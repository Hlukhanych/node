const CronJob = require('cron').CronJob;
const userModel = require('../models/user.model');
const { stringify } = require('csv-stringify/sync');
const fs = require('fs');

function startUserLoginReminderJob() {
    const job = new CronJob(
        '0 30 6 * * 1', // At 06:30 on Monday
        async () => {
            const date = new Date();
            date.setDate(date.getDate() - 7);

            const users = await userModel.find({
                $or: [
                    { lastLoginAt: { $exists: false} },
                    { lastLoginAt: { $lt: date } }
                ]});

            // send reminder email
            users.forEach(user => {
                console.log(`[userLoginReminder.job] Todo send reminder email for: ${user.email}`);
            });

            // or create report file
            const columns = {
                id: 'id',
                email: 'Name'
            };
            const rows = users.map(user => ([user.id, user.email]));
            try {
                const data = await stringify([
                    columns,
                    ...rows
                ], {
                    delimiter: ';'
                });
                await fs.writeFileSync(`public/${Date.now()}.csv`, data);
            } catch (err) {
                console.error(err);
            }
        },
    );

    job.start();
}

module.exports = startUserLoginReminderJob;