// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAppInfos } from '@polkadot/api-derive/types';

import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useApi, useCall, useLoadingDelay } from '@polkadot/react-hooks';
import { Input, Table } from '@polkadot/react-components';
//import { BN_ZERO } from '@polkadot/util';
import { useTranslation } from '../translate';

import Account from './Account';


interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}


function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [filterOn, setFilter] = useState<string>('');

  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('AppName'), 'start', 2],
    [t('AppId'), 'start'],
    [t('Rebate'), 'start'],
    [t('Manage accounts'), 'start'],
    [t('Manage key'), 'start'],
    [t('Platform comments'), 'start'],
    [t('Mortgage kpt'), 'start'],
    [],
    [],
  ]);

  useEffect((): void => {

  }, []);

  useEffect(() => {

  }, []);



  const footer = useMemo(() => (
    <tr>
      <td className='address'  />
      <td className='address' />
      <td className='address' />
      <td className='address' />
      <td className='address' />
      <td className='number' />
      <td className='address' />
      <td />
      <td />
      <td />
    </tr>
  ), []);

  const filter = useMemo(() => (
    <div className='filter--tags'>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name or tags')}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  ), [filterOn, t]);

   const apps = useCall<DeriveAppInfos>(api.derive.members.apps);
   console.log("apps:", JSON.stringify(apps));
   if (!!apps) {
     apps.forEach(app => {
       console.log("app:", JSON.stringify(app));
     });
   }

  return (
    <div className={className}>
      <Table
        empty={(!isLoading && apps) && t<string>("")}
        filter={filter}
        footer={footer}
        header={headerRef.current}
      >
        {!isLoading && apps?.map(( app , index): React.ReactNode => (
          <Account
            adminAccount={app.adminAccount}
            appId={app.appId}
            appName={app.appName}
            identityAccount={app.identityAccount}
            platformCommentsExpert={app.platformExperts}
            returnRate={app.returnRate}
            stake={app.stake}
            key={index}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
