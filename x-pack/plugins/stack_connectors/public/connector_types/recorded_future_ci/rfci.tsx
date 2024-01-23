/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  ActionTypeModel,
  GenericValidationResult,
} from '@kbn/triggers-actions-ui-plugin/public/types';
import { lazy } from 'react';
import { RFCIActionParams, RFCIConfig, RFCISecrets } from '../types';
import * as i18n from './translations';

const rficDefaultBody = `{
  "alert": {{alert}},
  "context": {{context}},
  "rule": {{rule}},
  "state": {{state}},
  "date": "{{date}}",
  "kibana_base_url": "{{kibanaBaseUrl}}"
}`;

function replaceReferencesWithNumbers(body: string) {
  return body.replace(/\{\{[.\w]+\}\}/gm, '42');
}

export function getActionType(): ActionTypeModel<RFCIConfig, RFCISecrets, RFCIActionParams> {
  const validateParams = async (
    actionParams: RFCIActionParams
  ): Promise<GenericValidationResult<RFCIActionParams>> => {
    const translations = await import('./translations');
    const errors = {
      body: [] as string[],
    };
    const validationResult = { errors };
    validationResult.errors = errors;
    if (!actionParams.body?.length) {
      errors.body.push(translations.BODY_REQUIRED);
    } else {
      try {
        JSON.parse(replaceReferencesWithNumbers(actionParams.body || ''));
      } catch (e) {
        errors.body.push(translations.INVALID_JSON);
      }
    }
    return validationResult;
  };
  return {
    id: '.recorded_future_ci',
    iconClass: lazy(() => import('./logo')),
    selectMessage: i18n.RFCI_SELECT_MESSAGE,
    actionTypeTitle: i18n.RFCI_ACTION_TYPE_TITLE,
    validateParams,
    actionConnectorFields: lazy(() => import('./rfci_connectors')),
    actionParamsFields: lazy(() => import('./rfic_params')),
    defaultActionParams: {
      body: rficDefaultBody,
    },
  };
}
