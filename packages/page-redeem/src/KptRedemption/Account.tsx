// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAccountFinanceRecord } from '@polkadot/api-derive/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';


import { ProxyDefinition, RecoveryConfig } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Delegation } from '../types';

import BN from 'bn.js';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressSmall, Badge, CryptoType, Forget, Icon, IdentityIcon, Tags } from '@polkadot/react-components';
import { useAccountInfo, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import {  formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
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
  param2: Array<string>;
  account: KeyringAddress;
  className?: string;
  delegation?: Delegation;
  filter: string;
  isFavorite: boolean;
  proxy?: [ProxyDefinition[], BN];
  setBalance: (address: string, value: BN) => void;
  toggleFavorite: (address: string) => void;
}




const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function Account ({  param2 = [], account: { address, meta }, className = '', delegation, filter, isFavorite, proxy, setBalance, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();

  var newParam2: Array<string|number>=[];
  if(!!param2 && param2.length > 0){
    newParam2.push(address+'');
    newParam2.push(Number(param2[0]));
    newParam2.push(param2[2]);
  }
 // console.log("newParam2:"+JSON.stringify(newParam2));
  const redemptionInfo = useCall<DeriveAccountFinanceRecord>(api.api.derive.kp.accountFinanceRecord, newParam2);
  //console.log("redemptionInfo:"+JSON.stringify(redemptionInfo));

  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], transformRecovery);
  const multiInfos = useMultisigApprovals(address);
  const proxyInfo = useProxies(address);
  const { flags: { isProxied }, tags } = useAccountInfo(address);
  const [isBackupOpen, toggleBackup] = useToggle();
  const [isDeriveOpen, toggleDerive] = useToggle();
  const [isForgetOpen, toggleForget] = useToggle();
  const [isIdentityMainOpen, toggleIdentityMain] = useToggle();
  const [isIdentitySubOpen, toggleIdentitySub] = useToggle();
  const [isMultisigOpen, toggleMultisig] = useToggle();
  const [isProxyOverviewOpen, toggleProxyOverview] = useToggle();
  const [isPasswordOpen, togglePassword] = useToggle();
  const [isRecoverAccountOpen, toggleRecoverAccount] = useToggle();
  const [isRecoverSetupOpen, toggleRecoverSetup] = useToggle();
  const [isTransferOpen, toggleTransfer] = useToggle();
  const [isDelegateOpen, toggleDelegate] = useToggle();
  const [isUndelegateOpen, toggleUndelegate] = useToggle();

  useEffect((): void => {

  }, []);

  useEffect((): void => {

  }, []);


  const _onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
  );

  const _onForget = useCallback(
    (): void => {
      if (!address) {
        return;
      }

      const status: Partial<ActionStatus> = {
        account: address,
        action: 'forget'
      };

      try {
        keyring.forgetAccount(address);
        status.status = 'success';
        status.message = t<string>('account forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [address, t]
  );




  return (
    <tr className={className}>
      <td className='favorite'>
        <Icon
          color={isFavorite ? 'orange' : 'gray'}
          icon='star'
          onClick={_onFavorite}
        />
      </td>
      <td className='together'>
        {recoveryInfo && (
          <Badge
            color='green'
            hover={
              <div>
                <p>{t<string>('This account is recoverable, with the following friends:')}</p>
                <div>
                  {recoveryInfo.friends.map((friend, index): React.ReactNode => (
                    <IdentityIcon
                      key={index}
                      value={friend}
                    />
                  ))}
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>{t<string>('threshold')}</td>
                      <td>{formatNumber(recoveryInfo.threshold)}</td>
                    </tr>
                    <tr>
                      <td>{t<string>('delay')}</td>
                      <td>{formatNumber(recoveryInfo.delayPeriod)}</td>
                    </tr>
                    <tr>
                      <td>{t<string>('deposit')}</td>
                      <td>{formatBalance(recoveryInfo.deposit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            icon='shield'
          />
        )}
        {multiInfos && multiInfos.length !== 0 && (
          <Badge
            color='red'
            hover={t<string>('Multisig approvals pending')}
            info={multiInfos.length}
          />
        )}
        {isProxied && !proxyInfo.hasOwned && (
          <Badge
            color='red'
            hover={t<string>('Proxied account has no owned proxies')}
            info='0'
          />
        )}
        {delegation?.accountDelegated && (
          <Badge
            color='blue'
            hover={t<string>('This account has a governance delegation')}
            icon='calendar-check'
            onClick={toggleDelegate}
          />
        )}
        {!!proxy?.[0].length && (
          <Badge
            color='blue'
            hover={t<string>('This account has {{proxyNumber}} proxy set.', {
              replace: {
                proxyNumber: proxy[0].length
              }
            })}
            icon='arrow-right'
            onClick={toggleProxyOverview}
          />
        )}
      </td>
      <td className='address'>
        <AddressSmall value={address} />
        {isBackupOpen && (
          <Backup
            address={address}
            key='modal-backup-account'
            onClose={toggleBackup}
          />
        )}
        {isDelegateOpen && (
          <DelegateModal
            key='modal-delegate'
            onClose={toggleDelegate}
            previousAmount={delegation?.amount}
            previousConviction={delegation?.conviction}
            previousDelegatedAccount={delegation?.accountDelegated}
            previousDelegatingAccount={address}
          />
        )}
        {isDeriveOpen && (
          <Derive
            from={address}
            key='modal-derive-account'
            onClose={toggleDerive}
          />
        )}
        {isForgetOpen && (
          <Forget
            address={address}
            key='modal-forget-account'
            onClose={toggleForget}
            onForget={_onForget}
          />
        )}
        {isIdentityMainOpen && (
          <IdentityMain
            address={address}
            key='modal-identity-main'
            onClose={toggleIdentityMain}
          />
        )}
        {isIdentitySubOpen && (
          <IdentitySub
            address={address}
            key='modal-identity-sub'
            onClose={toggleIdentitySub}
          />
        )}
        {isPasswordOpen && (
          <ChangePass
            address={address}
            key='modal-change-pass'
            onClose={togglePassword}
          />
        )}
        {isTransferOpen && (
          <Transfer
            key='modal-transfer'
            onClose={toggleTransfer}
            senderId={address}
          />
        )}
        {isProxyOverviewOpen && (
          <ProxyOverview
            key='modal-proxy-overview'
            onClose={toggleProxyOverview}
            previousProxy={proxy}
            proxiedAccount={address}
          />
        )}
        {isMultisigOpen && multiInfos && (
          <MultisigApprove
            address={address}
            key='multisig-approve'
            onClose={toggleMultisig}
            ongoing={multiInfos}
            threshold={meta.threshold as number}
            who={meta.who as string[]}
          />
        )}
        {isRecoverAccountOpen && (
          <RecoverAccount
            address={address}
            key='recover-account'
            onClose={toggleRecoverAccount}
          />
        )}
        {isRecoverSetupOpen && (
          <RecoverSetup
            address={address}
            key='recover-setup'
            onClose={toggleRecoverSetup}
          />
        )}
        {isUndelegateOpen && (
          <UndelegateModal
            accountDelegating={address}
            key='modal-delegate'
            onClose={toggleUndelegate}
          />
        )}
      </td>
      <td className='address media--1400'>
        {meta.parentAddress && (
          <AddressMini value={meta.parentAddress} />
        )}
      </td>
      <td className='number'>
        <CryptoType accountId={address} />
      </td>
      <td className='all'>
        <div className='tags'>
          <Tags value={tags} />
        </div>
      </td>
      <td className='number'>
        <AddressInfo
          address={address}
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='address'>
        {redemptionInfo?redemptionInfo.maxAmount+' KPT':'0 KPT'}
      </td>

      <td className='address'>
        {redemptionInfo?redemptionInfo.actuallyAmount+' KPT':'0 KPT'}
      </td>
      <td className='button'>

      </td>
      <td >

      </td>
    </tr>
  );
}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
