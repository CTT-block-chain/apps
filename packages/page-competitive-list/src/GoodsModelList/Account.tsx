// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  param2: Array;
  className?: string;
  intoType?: string;
  appId?: int;
  blockNumber?: string;
  modelID?: string;
}

interface DemocracyUnlockable {
  democracyUnlockTx: SubmittableExtrinsic<'promise'> | null;
  ids: BN[];
}

function calcVisible (filter: string, name: string, tags: string[]): boolean {
  if (filter.length === 0) {
    return true;
  }

  const _filter = filter.toLowerCase();

  return tags.reduce((result: boolean, tag: string): boolean => {
    return result || tag.toLowerCase().includes(_filter);
  }, name.toLowerCase().includes(_filter));
}

function createClearDemocracyTx (api: ApiPromise, address: string, unlockableIds: BN[]): SubmittableExtrinsic<'promise'> {
  return api.tx.utility.batch(
    unlockableIds
      .map((id) => api.tx.democracy.removeVote(id))
      .concat(api.tx.democracy.unlock(address))
  );
}

const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function Account ({ param2 = [], className = '', appId=0, intoType='', blockNumber='', modelID='',}: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { queueExtrinsic } = useContext(StatusContext);
  const api = useApi();


  useEffect((): void => {

  }, []);

  useEffect((): void => {

  }, []);

  let appIdStr: string = '';
  let cycle: string = '';//榜单期数

  console.log("param2--account:"+JSON.stringify(param2))

  if(!!param2 && param2.length > 0 ){

    if( !!param2[2] ){

      console.log("param2[0]:"+param2[0]);//[1000,123190,""]   appId, blockNumber, modelId

      appIdStr = param2[0].toString();

      cycle = param2[1].toString();

    }else{//清空数据，modelId为空的不查,只查模型榜单

      param2[0]='';
      param2[1]='';
      param2[2]='';
    }

  }


  const lb = useCall<DeriveLeaderboardData>(api.api.derive.kp.leaderboardRecord, [param2]);

  /* console.log("queryStatus--account:"+intoType);
  console.log("appId:--account"+appId);
  console.log("blockNumber--account:"+blockNumber);
  console.log("modelID--account:"+modelID); */

  let flag = false;
  if( intoType == 'query' && param2[0] == appId && param2[1] == blockNumber && param2[2] == modelID){
    flag = true;
  }else if( intoType == 'default' ){
    flag = true;
  }
  if(flag){
    var board: Array=[];
    var accounts: Array=[];

    if( !!lb ){
      if( !!lb.accounts && lb.accounts.length > 0){
        accounts = lb.accounts;
      }
      if(!!lb.board && lb.board.length > 0){
        board = lb.board;
      }
    }
    console.log("board:"+JSON.stringify(board));
    console.log("accounts:"+JSON.stringify(accounts));



    const status = '正常';

    let a: Number = 0;
    if( !!board && board.length > 0){

      for(a = 0 ; a < board.length ; a++){
        let power: String = '';
        if( board[a].power != 0){
          power = parseFloat( Number( board[a].power ) / 100.00 ).toFixed(4).toString()
        }else{
          power = '0.0000'
        }
        let address: String = board[a].owner
        return (
          <tr className={className}>
            <td className='favorite'>

            </td>
            <td className='address'>
              { board[a].commodityId }
            </td>
            <td className='address'>
              {  appIdStr }
            </td>
            <td className='address'>
              <AddressSmall value={address} />
            </td>
            <td className='address'>
             {cycle}
            </td>
            <td className='address'>
             {a+1}
            </td>
            <td className='address'>
             {status}
            </td>
            <td className='number'>
             <FormatKP
               value={power}
               withSi
             />
            </td>
            <td />
            <td />
            <td />
          </tr>
        );
      }
    }else{
      return (
        <></>
      );
    }
  }else{
    return (
      <></>
    );
  }
}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
