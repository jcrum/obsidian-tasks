import { createStatusRegistryReport } from '../src/StatusRegistryReport';
import { StatusRegistry } from '../src/StatusRegistry';
import { StatusSettings } from '../src/Config/StatusSettings';
import type { StatusCollection, StatusCollectionEntry } from '../src/StatusCollection';
import { Status } from '../src/Status';
import { verifyWithFileExtension } from './TestingTools/ApprovalTestHelpers';

describe('StatusRegistryReport', function () {
    it('should create a report', () => {
        // Arrange

        const coreStatusesData: StatusCollection = [
            [' ', 'Todo', 'x', 'TODO'],
            ['x', 'Done', ' ', 'DONE'],
        ];

        const customStatusesData: StatusCollection = [
            ['Q', 'Question', 'A', 'NON_TASK'],
            ['A', 'Answer', 'Q', 'NON_TASK'],
        ];

        // Populate StatusSettings:
        const statusSettings = new StatusSettings();

        const core = statusSettings.coreStatuses;
        StatusSettings.replaceStatus(core, core[0], Status.createFromImportedValue(coreStatusesData[0]));
        StatusSettings.replaceStatus(core, core[1], Status.createFromImportedValue(coreStatusesData[1]));

        customStatusesData.map((entry: StatusCollectionEntry) => {
            StatusSettings.addStatus(statusSettings.customStatuses, Status.createFromImportedValue(entry));
        });

        // Populate StatusRegistry:
        const statusRegistry = new StatusRegistry();
        StatusSettings.applyToStatusRegistry(statusSettings, statusRegistry);

        const reportName = 'Review and check your Statuses';

        // Act
        const version = 'x.y.z'; // lower-case, as the capitalised version would get edited at the next release.
        const report = createStatusRegistryReport(statusSettings, statusRegistry, reportName, version);

        // Assert
        verifyWithFileExtension(report, '.md');
    });
});
