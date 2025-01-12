/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import expect from '@kbn/expect';
import { v4 as uuidv4 } from 'uuid';
import { FtrProviderContext } from '../../../ftr_provider_context';

const OPEN_IN_DISCOVER_DATA_TEST_SUBJ = 'embeddablePanelAction-ACTION_OPEN_IN_DISCOVER';

export default function ({ getService, getPageObjects }: FtrProviderContext) {
  const { visualize, lens, dashboard, header, discover, common } = getPageObjects([
    'visualize',
    'lens',
    'dashboard',
    'header',
    'discover',
    'common',
  ]);

  const listingTable = getService('listingTable');
  const testSubjects = getService('testSubjects');
  const dashboardPanelActions = getService('dashboardPanelActions');
  const filterBarService = getService('filterBar');
  const queryBar = getService('queryBar');
  const savedQueryManagementComponent = getService('savedQueryManagementComponent');
  const browser = getService('browser');
  const retry = getService('retry');

  describe('lens show underlying data from dashboard', () => {
    it('should show the open button for a compatible saved visualization', async () => {
      await visualize.gotoVisualizationLandingPage();
      await listingTable.searchForItemWithName('lnsXYvis');
      await lens.clickVisualizeListItemTitle('lnsXYvis');
      await lens.goToTimeRange();
      await lens.save('Embedded Visualization', true, false, false, 'new');

      await dashboard.saveDashboard(`Open in Discover Testing ${uuidv4()}`, {
        saveAsNew: true,
        exitFromEditMode: true,
      });

      await dashboardPanelActions.clickPanelAction(OPEN_IN_DISCOVER_DATA_TEST_SUBJ);

      const [dashboardWindowHandle, discoverWindowHandle] = await browser.getAllWindowHandles();
      await browser.switchToWindow(discoverWindowHandle);

      await header.waitUntilLoadingHasFinished();
      await testSubjects.existOrFail('unifiedHistogramChart');
      // check the table columns
      const columns = await discover.getColumnHeaders();
      expect(columns).to.eql(['@timestamp', 'ip', 'bytes']);

      await browser.closeCurrentWindow();
      await browser.switchToWindow(dashboardWindowHandle);
    });

    it('should show the open button for a compatible saved visualization with annotations and reference line', async () => {
      await dashboard.switchToEditMode();
      await dashboardPanelActions.clickEdit();
      await header.waitUntilLoadingHasFinished();
      await lens.createLayer('annotations');
      await lens.waitForVisualization('xyVisChart');

      await lens.createLayer('referenceLine');
      await lens.save('Embedded Visualization', false);

      await dashboard.saveDashboard(`Open in Discover Testing ${uuidv4()}`, {
        saveAsNew: false,
        exitFromEditMode: true,
      });

      await dashboardPanelActions.clickPanelAction(OPEN_IN_DISCOVER_DATA_TEST_SUBJ);

      const [dashboardWindowHandle, discoverWindowHandle] = await browser.getAllWindowHandles();
      await browser.switchToWindow(discoverWindowHandle);

      await header.waitUntilLoadingHasFinished();
      await testSubjects.existOrFail('unifiedHistogramChart');
      // check the table columns
      const columns = await discover.getColumnHeaders();
      expect(columns).to.eql(['@timestamp', 'ip', 'bytes']);

      await browser.closeCurrentWindow();
      await browser.switchToWindow(dashboardWindowHandle);
    });

    it('should bring both dashboard context and visualization context to discover', async () => {
      await dashboard.switchToEditMode();
      await dashboardPanelActions.clickEdit();
      await savedQueryManagementComponent.openSavedQueryManagementComponent();
      await queryBar.switchQueryLanguage('lucene');
      await savedQueryManagementComponent.closeSavedQueryManagementComponent();
      await queryBar.setQuery('host.keyword www.elastic.co');
      await queryBar.submitQuery();
      await filterBarService.addFilter({ field: 'geo.src', operation: 'is', value: 'AF' });
      // the filter bar seems to need a moment to settle before saving and returning
      await common.sleep(1000);

      await lens.saveAndReturn();
      await savedQueryManagementComponent.openSavedQueryManagementComponent();
      await queryBar.switchQueryLanguage('kql');
      await savedQueryManagementComponent.closeSavedQueryManagementComponent();
      await queryBar.setQuery('request.keyword : "/apm"');
      await queryBar.submitQuery();
      await filterBarService.addFilter({
        field: 'host.raw',
        operation: 'is',
        value: 'cdn.theacademyofperformingartsandscience.org',
      });

      await dashboard.clickQuickSave();

      // make sure Open in Discover is also available in edit mode
      await dashboardPanelActions.expectExistsPanelAction(OPEN_IN_DISCOVER_DATA_TEST_SUBJ);
      await dashboard.clickCancelOutOfEditMode();

      await dashboardPanelActions.clickPanelAction(OPEN_IN_DISCOVER_DATA_TEST_SUBJ);

      const [dashboardWindowHandle, discoverWindowHandle] = await browser.getAllWindowHandles();
      await browser.switchToWindow(discoverWindowHandle);

      await header.waitUntilLoadingHasFinished();
      await discover.waitUntilSearchingHasFinished();

      await retry.waitFor('filter count to be correct', async () => {
        const filterCount = await filterBarService.getFilterCount();
        return filterCount === 3;
      });

      expect(
        await filterBarService.hasFilter('host.raw', 'cdn.theacademyofperformingartsandscience.org')
      ).to.be.ok();
      expect(await filterBarService.hasFilter('geo.src', 'AF')).to.be.ok();
      expect(await filterBarService.getFiltersLabel()).to.contain('Lens context (lucene)');
      expect(await queryBar.getQueryString()).to.be('request.keyword : "/apm"');

      await browser.closeCurrentWindow();
      await browser.switchToWindow(dashboardWindowHandle);
    });
  });
}
