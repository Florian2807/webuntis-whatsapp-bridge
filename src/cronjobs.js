const schedule = require('node-schedule');

schedule.scheduleJob(`*/${process.env.NODE_ENV === 'development' ? '1' : '1'} 6-8 * * *`, () => {
	wb.Utils.executeUpdate();
}); // Every minute from 6 to 8 a.m.
schedule.scheduleJob(`*/${process.env.NODE_ENV === 'development' ? '1' : '5'} 9-23 * * *`, () => {
	wb.Utils.executeUpdate();
}); // Every 5 minutes from 9 a.m. to 11 p.m.
schedule.scheduleJob(`*/${process.env.NODE_ENV === 'development' ? '1' : '60'} 0-7 * * *`, () => {
	wb.Utils.executeUpdate();
}); // Every 60 minutes from 12 a.m. to 5 a.m.
