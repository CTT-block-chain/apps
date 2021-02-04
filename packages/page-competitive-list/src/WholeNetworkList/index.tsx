// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveLeaderboardKeys} from '@polkadot/api-derive/types';

import { ActionStatus } from '@polkadot/react-components/Status/types';
//import { Voting } from '@polkadot/types/interfaces';
//import { Delegation, SortedAccount } from '../types';

//import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useApi, useCall, useLoadingDelay, useToggle } from '@polkadot/react-hooks';
import { Button, Input, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Proxy from '../modals/ProxiedAdd';
import Account from './Account';
//import { sortAccounts } from '../util';

/* interface Balances {
  accounts: Record<string, BN>;
  balanceTotal?: BN;
} */

/* interface Sorted {
  sortedAccounts: SortedAccount[];
  sortedAddresses: string[];
} */

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

//const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isProxyOpen, toggleProxy] = useToggle();
 // const { allAccounts, hasAccounts } = useAccounts();
  const [filterOn, setFilter] = useState<string>('');
  //const [sortedAccountsWithDelegation, setSortedAccountsWithDelegation] = useState<SortedAccount[] | undefined>();
 // const [{ sortedAccounts, sortedAddresses }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
  //const delegations = useCall<Voting[]>(api.query.democracy?.votingOf?.multi, [sortedAddresses]);

  //新增的
  const [queryLbParam, setQueryLbParam] = useState<any[] | undefined>();
  const [queryStatus, setQueryStatus] = useState<boolean>(false);
  const [appId, setAppId] = useState<Number>(0);
  const [blockNumber, setBlockNumber] = useState<string>('');
  const [modelID, setModelID] = useState<string>('');

 /* const proxies = useCall<[ProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [sortedAddresses], {
    transform: (result: [([AccountId, ProxyType] | ProxyDefinition)[], BN][]): [ProxyDefinition[], BN][] =>
      api.tx.proxy.addProxy.meta.args.length === 3
        ? result as [ProxyDefinition[], BN][]
        : (result as [[AccountId, ProxyType][], BN][]).map(([arr, bn]): [ProxyDefinition[], BN] =>
          [arr.map(([delegate, proxyType]): ProxyDefinition => api.createType('ProxyDefinition', { delegate, proxyType })), bn]
        )
  }); */
  const isLoading = useLoadingDelay();

  const lbKeys = useCall<DeriveLeaderboardKeys>(api.derive.kp.leaderboardKeys);
  console.log("lbKeys:" + JSON.stringify(lbKeys));

  const headerRef = useRef([
    [t('Experience goods id'), 'start', 2],
    [t('AppId'), 'start'],
    [t('Goods type id'), 'start'],
    [t('accounts'), 'start'],
    [t('List period'), 'start'],
    [t('Ranking'), 'start'],
    [t('state'), 'start'],
    [t('Knowledge power (kp)'), 'expand'],
    [],
    [],
  ]);

  useEffect((): void => {


  }, []);

  useEffect(() => {
   /* if (api.query.democracy?.votingOf && !delegations?.length) {
      return;
    } */
    console.log(appId + ', ' + blockNumber + ', ' + modelID);
    if(appId!=0){
      setFilter(appId + ', ' + blockNumber + ', ' + modelID);
    }

    setQueryLbParam(lbKeys);

  }, [api, appId, blockNumber, modelID, lbKeys]);

 /* const _setBalance = useCallback(
    (account: string, balance: BN) =>
      setBalances(({ accounts }: Balances): Balances => {
        accounts[account] = balance;
        return {
          accounts,
          balanceTotal: Object.values(accounts).reduce((total: BN, value: BN) => total.add(value), BN_ZERO)
        };
      }),
    []
  ); */


  const footer = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <td className='media--1400' />
      <td colSpan={2} />
      <td className='media--1500' />
      <td />
      <td />
      <td className='number'>

      </td>
      <td className='number'>

      </td>
      <td />
    </tr>
  ), []);

  const filter = useMemo(() => (
    <div className='filter--tags'>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name appId , blockNumber , or modelId')}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  ), [filterOn, t]);

  var valueList: Array<string>=[];
  //默认显示榜单最新一期：
   let queryLbParamItem: any;
   if( !!queryLbParam && queryLbParam.length > 0 ){
     queryLbParam.forEach((val, idx, array) => {
        if(blockNumber!=''){
          if(val[1]+''== blockNumber+''){
            queryLbParamItem = val;
          }
          if(val[0]!='' && val[1]!=''){
            valueList.push(val[1]+'');
          }
        }else{
          if(val[0]!='' && val[1]!=''){
            valueList.push(val[1]+'');
            queryLbParamItem = val;
          }
        }
     });
   }
  //console.log("queryLbParamItem:" + JSON.stringify(queryLbParamItem));

  /*
  //循环显示所有期数
  {!isLoading && queryLbParam && queryLbParam.map((pa, index): React.ReactNode => (
     <Account
        param2={pa}
        cycle={index}
      />
      ))
   } */
  /* console.log("queryStatus:"+queryStatus);
  console.log("appId:"+appId);
  console.log("blockNumber:"+blockNumber);
  console.log("modelID:"+modelID); */

  return (
    <div className={className}>
      {isProxyOpen && (
        <Proxy
          valueList={valueList}
          onClose={toggleProxy}
          onStatusChange={onStatusChange}
          changeQueryStatus={setQueryStatus}
          changeAppId={setAppId}
          changeBlockNumber={setBlockNumber}
          changeModelID={setModelID}
        />
      )}
      <Button
        icon='plus'
        isDisabled={false}
        label={t<string>('List query')}
        onClick={toggleProxy}
      />
    <div className={className} >
    </div>
      <Table
        empty={( (!isLoading && queryLbParam)) && t<string>("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}
        filter={filter}
        footer={footer}
        header={headerRef.current}
      >
        {!isLoading && !queryStatus && queryLbParam&&
         <Account
            param2={queryLbParamItem}
            intoType={'default'}
            appId={appId}
            blockNumber={blockNumber}
            modelID={modelID}
          />
        }
        {queryStatus && queryLbParam &&queryLbParam.map((pa, index): React.ReactNode => (
         <Account
            key={index}
            param2={pa}
            intoType={'query'}
            appId={appId}
            blockNumber={blockNumber}
            modelID={modelID}
          />
          ))
        }
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
