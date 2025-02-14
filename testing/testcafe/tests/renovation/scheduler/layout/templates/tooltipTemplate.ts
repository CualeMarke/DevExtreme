import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery'],
});

fixture.disablePageReloads.skip('Layout:Templates:appointmentTooltipTemplate'); // TODO unskip after fix tooltip

test('appointmentTooltipTemplate layout should be rendered right', async (t, { screenshotComparerOptions }) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(scheduler.getAppointmentByIndex().element);

  await t
    .expect(await takeScreenshot('appointment-tooltip-template.png', scheduler.element, screenshotComparerOptions))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: [{
      startDate: new Date(2017, 4, 25, 0, 30),
      endDate: new Date(2017, 4, 25, 2, 30),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2017, 4, 25),
    appointmentTooltipTemplate: ClientFunction((appointment) => {
      const result = $('<div  style=\'display: flex; flex-wrap: wrap;\' />');

      const startDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.startDate,
      });

      const endDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.endDate,
      });

      result.append(startDateBox, endDateBox);

      return result;
    }),
    height: 600,
  });
});
