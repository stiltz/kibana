/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const URL_LABEL = i18n.translate('xpack.stackConnectors.rfciAction.urlTextFieldLabel', {
  defaultMessage: 'Recorded Future Collective Insights endpoint URL',
});

export const URL_INVALID = i18n.translate(
  'xpack.stackConnectors.rfciAction.error.invalidUrlTextField',
  {
    defaultMessage: 'URL is invalid.',
  }
);

export const BODY_FIELD_LABEL = i18n.translate('xpack.stackConnectors.rfciAction.bodyFieldLabel', {
  defaultMessage: 'Body',
});

export const BODY_FIELD_ARIA_LABEL = i18n.translate(
  'xpack.stackConnectors.rfciAction.bodyCodeEditorAriaLabel',
  {
    defaultMessage: 'Code editor',
  }
);

export const URL_NOT_RFCI_WEBHOOK = i18n.translate(
  'xpack.stackConnectors.rfciAction.error.urlIsNotRFCIWebhook',
  {
    defaultMessage: 'URL is not a Recorded Future Collective Insights integration endpoint.',
  }
);

export const RFCI_TOKEN_LABEL = i18n.translate('xpack.stackConnectors.rfciAction.token', {
  defaultMessage: 'Recorded Future Collective Insights API Token',
});

export const RFCI_TOKEN_REQUIRED = i18n.translate(
  'xpack.stackConnectors.error.requiredWebhookRFCITokenText',
  {
    defaultMessage: 'Recorded Future Collective Insights API token is required.',
  }
);

export const BODY_REQUIRED = i18n.translate('xpack.stackConnectors.error.requiredWebhookBodyText', {
  defaultMessage: 'Body is required.',
});

export const INVALID_JSON = i18n.translate('xpack.stackConnectors.error.requireValidJSONBody', {
  defaultMessage: 'Body must be a valid JSON.',
});

export const RFCI_SELECT_MESSAGE = i18n.translate(
  'xpack.stackConnectors.rfciAction.selectMessageText',
  {
    defaultMessage: 'Trigger a Recorded Future Collective Insights workflow.',
  }
);

export const RFCI_ACTION_TYPE_TITLE = i18n.translate(
  'xpack.stackConnectors.rfciAction.actionTypeTitle',
  {
    defaultMessage: 'Alert data',
  }
);

export const RFCI_TOKEN_HELP_TEXT = i18n.translate(
  'xpack.stackConnectors.rfciAction.tokenHelpText',
  {
    defaultMessage:
      'Enter the webhook authentication header secret generated when you created the Elastic Security integration.',
  }
);

export const URL_HELP_TEXT = i18n.translate('xpack.stackConnectors.rfciAction.urlHelpText', {
  defaultMessage:
    'Enter the endpoint URL generated when you created the Elastic Security integration on Recorded Future Collective Insights API (Not needed - delete).',
});

export const HOW_TO_TEXT = i18n.translate(
  'xpack.stackConnectors.rfciActionConnectorFields.calloutTitle',
  {
    defaultMessage:
      'Create an Elastic Security integration on Recorded Future Collective Insights API, and then come back and paste the endpoint URL and token generated for your integration.',
  }
);
