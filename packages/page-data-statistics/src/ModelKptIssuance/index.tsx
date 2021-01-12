// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveModelRewardRecords} from '@polkadot/api-derive/types';

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { } from '@polkadot/types/interfaces';
//import { Delegation, SortedAccount } from '../types';

//import BN from 'bn.js';
import React, {  useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useApi,  useCall, useLoadingDelay } from '@polkadot/react-hooks';

import { Input, Table } from '@polkadot/react-components';
//import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import Account from './Account';
//import { sortAccounts } from '../util';
import Summary from './Summary';

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

 // const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  //const [{ balanceTotal }, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
 // const [sortedAccountsWithDelegation, setSortedAccountsWithDelegation] = useState<SortedAccount[] | undefined>();
 /// const [{ sortedAccounts, sortedAddresses }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
 // const delegations = useCall<Voting[]>(api.query.democracy?.votingOf?.multi, [sortedAddresses]);

  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('Model id'), 'start', 2],
    [t('accounts'), 'start'],
    [t('AppId'), 'start'],
    [t(''), 'start'],
    [t('Number of additional issuances (KPT)'), 'expand'],
    [t(''), 'expand'],
    [],
    [],
    [],
  ]);

  useEffect((): void => {

  }, []);

  useEffect(() => {
    /* if (api.query.democracy?.votingOf && !delegations?.length) {
      return;
    }

   setSortedAccountsWithDelegation(
      sortedAccounts?.map((account, index) => {
        let delegation: Delegation | undefined;
        if (delegations && delegations[index]?.isDelegating) {
          const { balance: amount, conviction, target } = delegations[index].asDelegating;

          delegation = {
            accountDelegated: target.toString(),
            amount,
            conviction
          };
        }
      return ({
          ...account,
          delegation
        });
      })
    );
  */
  }, [api]);

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
        label={t<string>('filter by number of additional issues')}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  ), [filterOn, t]);

  const allRewardsRecord = useCall<DeriveModelRewardRecords[]>(api.derive.kp.allRewardsRecord);

  console.log("allRewardsRecord:" + JSON.stringify(allRewardsRecord));


  return (
    <div className={className}>
      <div className={className} >
       <Summary/>
      </div>
      <Table
        empty={(!isLoading && allRewardsRecord) && t<string>("")}
        filter={filter}
        footer={footer}
        header={headerRef.current}
      >
        {!isLoading && allRewardsRecord?.map((models, index): React.ReactNode => (
          <Account
            account={models.account}
            appId={models.appId}
            modelId={models.modelId}
            //status={models.status}
            rewards={models.rewards?models.rewards:[]}
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
