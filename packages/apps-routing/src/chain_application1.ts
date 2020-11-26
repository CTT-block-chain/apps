// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-settings';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'chain_application',
    icon: 'browser',
    name: 'chain_application',
    text: t('nav.chain_application', 'Chain Application', { ns: 'apps-routing' }),
    //useCounter
  };
}
