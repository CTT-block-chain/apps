// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-issuance-fund';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.treasury.proposeSpend'
      ]
    },
    group: 'governance',
    icon: 'dollar-sign',//gem
    name: 'issuance_fund',
    text: t('nav.issuance_fund', 'Issuance Fund', { ns: 'apps-routing' }),
    useCounter
  };
}
