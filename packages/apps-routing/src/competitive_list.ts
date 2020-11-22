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
    icon: 'database',
    name: 'competitive_list',
    text: t('nav.competitive_list', 'Competitive List', { ns: 'apps-routing' })
  };
}
