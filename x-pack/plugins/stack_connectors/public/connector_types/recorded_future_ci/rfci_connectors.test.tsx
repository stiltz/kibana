/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mountWithIntl } from '@kbn/test-jest-helpers';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ConnectorFormTestProvider, waitForComponentToUpdate } from '../lib/test_utils';
import RFCIActionConnectorFields from './rfci_connectors';

const EMPTY_FUNC = () => {};

describe('RFCIActionConnectorFields renders', () => {
  test('all connector fields are rendered', async () => {
    const actionConnector = {
      actionTypeId: '.recorded_future_ci',
      name: 'recorded_future_ci',
      config: {
        webhookIntegrationUrl: 'https://api.recordedfuture.com/collective-insights/detections',
      },
      secrets: {
        token: 'testtoken',
      },
      isDeprecated: false,
    };

    const wrapper = mountWithIntl(
      <ConnectorFormTestProvider connector={actionConnector}>
        <RFCIActionConnectorFields
          readOnly={false}
          isEdit={false}
          registerPreSubmitValidator={EMPTY_FUNC}
        />
      </ConnectorFormTestProvider>
    );

    await waitForComponentToUpdate();

    expect(wrapper.find('[data-test-subj="rfciUrlText"]').length > 0).toBeTruthy();
    expect(wrapper.find('[data-test-subj="rfciTokenInput"]').length > 0).toBeTruthy();
  });

  describe('Validation', () => {
    const onSubmit = jest.fn();
    const actionConnector = {
      actionTypeId: '.recorded_future_ci',
      name: 'recorded_future_ci',
      config: {
        webhookIntegrationUrl: 'https://api.recordedfuture.com/collective-insights/detections',
      },
      secrets: {
        token: 'testtoken',
      },
      isDeprecated: false,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('connector validation succeeds when connector config is valid', async () => {
      const { getByTestId } = render(
        <ConnectorFormTestProvider connector={actionConnector} onSubmit={onSubmit}>
          <RFCIActionConnectorFields
            readOnly={false}
            isEdit={false}
            registerPreSubmitValidator={EMPTY_FUNC}
          />
        </ConnectorFormTestProvider>
      );

      await act(async () => {
        userEvent.click(getByTestId('form-test-provide-submit'));
      });

      expect(onSubmit).toBeCalledWith({
        data: {
          actionTypeId: '.recorded_future_ci',
          name: 'recorded_future_ci',
          config: {
            webhookIntegrationUrl: 'https://api.recordedfuture.com/collective-insights/detections',
          },
          secrets: {
            token: 'testtoken',
          },
          isDeprecated: false,
        },
        isValid: true,
      });
    });

    it('connector validation fails when there is no token', async () => {
      const connector = {
        ...actionConnector,
        secrets: {
          token: '',
        },
      };

      const { getByTestId } = render(
        <ConnectorFormTestProvider connector={connector} onSubmit={onSubmit}>
          <RFCIActionConnectorFields
            readOnly={false}
            isEdit={false}
            registerPreSubmitValidator={EMPTY_FUNC}
          />
        </ConnectorFormTestProvider>
      );

      await act(async () => {
        userEvent.click(getByTestId('form-test-provide-submit'));
      });

      expect(onSubmit).toBeCalledWith({
        data: {},
        isValid: false,
      });
    });

    it('connector validation fails when there is no webhook URL', async () => {
      const connector = {
        ...actionConnector,
        config: {
          webhookIntegrationUrl: '',
        },
      };

      const { getByTestId } = render(
        <ConnectorFormTestProvider connector={connector} onSubmit={onSubmit}>
          <RFCIActionConnectorFields
            readOnly={false}
            isEdit={false}
            registerPreSubmitValidator={EMPTY_FUNC}
          />
        </ConnectorFormTestProvider>
      );

      await act(async () => {
        userEvent.click(getByTestId('form-test-provide-submit'));
      });

      expect(onSubmit).toBeCalledWith({
        data: {},
        isValid: false,
      });
    });

    it('connector validation fails if the URL is not of a Recorded Future Collective Insights webhook', async () => {
      const connector = {
        ...actionConnector,
        config: {
          webhookIntegrationUrl: 'https://api.recordedfuture.com/collective-insights/detections',
        },
      };

      const { getByTestId } = render(
        <ConnectorFormTestProvider connector={connector} onSubmit={onSubmit}>
          <RFCIActionConnectorFields
            readOnly={false}
            isEdit={false}
            registerPreSubmitValidator={EMPTY_FUNC}
          />
        </ConnectorFormTestProvider>
      );

      await act(async () => {
        userEvent.click(getByTestId('form-test-provide-submit'));
      });

      expect(onSubmit).toBeCalledWith({
        data: {},
        isValid: false,
      });
    });
  });
});
