// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { DeriveAccountPowers } from '@polkadot/api-derive/types';

import { FormatKP } from '@polkadot/react-query';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveBalancesAll, DeriveDemocracyLock } from '@polkadot/api-derive/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ThemeDef } from '@polkadot/react-components/types';
import { ProxyDefinition, RecoveryConfig } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Delegation } from '../types';

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { getLedger } from '@polkadot/react-api';
import { AddressInfo, AddressMini, AddressSmall, Badge, Button, ChainLock, CryptoType, Forget, Icon, IdentityIcon, LinkExternal, Menu, Popup, StatusContext, Tags } from '@polkadot/react-components';
import { useAccountInfo, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { createMenuGroup } from '../util';
import Backup from '../modals/Backup';
import ChangePass from '../modals/ChangePass';
import DelegateModal from '../modals/Delegate';
import Derive from '../modals/Derive';
import IdentityMain from '../modals/IdentityMain';
import IdentitySub from '../modals/IdentitySub';
import ProxyOverview from '../modals/ProxyOverview';
import MultisigApprove from '../modals/MultisigApprove';
import RecoverAccount from '../modals/RecoverAccount';
import RecoverSetup from '../modals/RecoverSetup';
import Transfer from '../modals/Transfer';
import UndelegateModal from '../modals/Undelegate';
import useMultisigApprovals from './useMultisigApprovals';
import useProxies from './useProxies';

interface Props {
  adminAccount?: string;
  appId?: int;
  appName?: string;
  identityAccount?: string;
  returnRate?: int;
  stake?: int;
  className?: string;
}

function Account ({ adminAccount = '', appId = 0, appName = '' , identityAccount = '', returnRate = 0, stake=0, className = ''}: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { queueExtrinsic } = useContext(StatusContext);
  const api = useApi();

  useEffect((): void => {

  }, []);

  useEffect((): void => {

  }, []);

   return (
     <tr className={className}>
       <td className='favorite'>

       </td>
       <td className='address'>
         {appName}
       </td>
       <td className='address'>
         <AddressSmall value={adminAccount} />
       </td>
       <td className='address'>
         <AddressSmall value={identityAccount} />
       </td>
       <td className='address'>
         {
           appId+''
           /*
           这里必须变成字符串，不然会报错
           */
         }
       </td>
       <td className='number'>
         {stake+''}
       </td>
      <td  className='address'/>
      <td  />
       <td  />
        <td  />
     </tr>

   );

}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
