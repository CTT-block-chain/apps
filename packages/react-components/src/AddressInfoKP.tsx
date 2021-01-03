// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAll, DeriveDemocracyLock, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { BlockNumber, LockIdentifier, ValidatorPrefsTo145 } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { TFunction } from 'i18next';
import styled from 'styled-components';
import { BN_ZERO, formatBalance, formatNumber, hexToString, isObject } from '@polkadot/util';
import { Expander, Icon, Tooltip } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api/hoc';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance,FormatKP } from '@polkadot/react-query';

import DemocracyLocks from './DemocracyLocks';
import StakingRedeemable from './StakingRedeemable';
import StakingUnbonding from './StakingUnbonding';
import CryptoType from './CryptoType';
import Label from './Label';
import { useTranslation } from './translate';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
  available?: boolean;
  bonded?: boolean | BN[];
  extraInfo?: [React.ReactNode, React.ReactNode][];
  locked?: boolean;
  redeemable?: boolean;
  reserved?: boolean;
  total?: boolean;
  unlocking?: boolean;
  vested?: boolean;
}

export interface CryptoActiveType {
  crypto?: boolean;
  nonce?: boolean;
}

export interface ValidatorPrefsType {
  unstakeThreshold?: boolean;
  validatorPayment?: boolean;
}

interface Props {
  kpInfo?: Any;
  address: string;
  balancesAll?: DeriveBalancesAll;
  children?: React.ReactNode;
  className?: string;
  democracyLocks?: DeriveDemocracyLock[];
  extraInfo?: [string, string][];
  stakingInfo?: DeriveStakingAccount;
  withBalance?: boolean | BalanceActiveType;
  withBalanceToggle?: false;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId?: (string | null)[];
  withValidatorPrefs?: boolean | ValidatorPrefsType;
  withoutLabel?: boolean;
}

const DEFAULT_BALANCES: BalanceActiveType = {
  available: true,
  bonded: true,
  locked: true,
  redeemable: true,
  reserved: true,
  total: true,
  unlocking: true,
  vested: true
};
const DEFAULT_EXTENDED = {
  crypto: true,
  nonce: true
};
const DEFAULT_PREFS = {
  unstakeThreshold: true,
  validatorPayment: true
};

function lookupLock (lookup: Record<string, string>, lockId: LockIdentifier): string {
  const lockHex = lockId.toHex();

  try {
    const lockName = hexToString(lockHex);

    return lookup[lockName] || lockName;
  } catch (error) {
    return lockHex;
  }
}

// skip balances retrieval of none of this matches
function skipBalancesIf ({ withBalance = true, withExtended = false }: Props): boolean {
  if (withBalance === true || withExtended === true) {
    return false;
  } else if (isObject(withBalance)) {
    // these all pull from the all balances
    if (withBalance.available || withBalance.locked || withBalance.reserved || withBalance.total || withBalance.vested) {
      return false;
    }
  } else if (isObject(withExtended)) {
    if (withExtended.nonce) {
      return false;
    }
  }

  return true;
}

function skipStakingIf ({ stakingInfo, withBalance = true, withValidatorPrefs = false }: Props): boolean {
  if (stakingInfo) {
    return true;
  } else if (withBalance === true || withValidatorPrefs) {
    return false;
  } else if (isObject(withBalance)) {
    if (withBalance.unlocking || withBalance.redeemable) {
      return false;
    } else if (withBalance.bonded) {
      return Array.isArray(withBalance.bonded);
    }
  }

  return true;
}

// calculates the bonded, first being the own, the second being nominated
function calcBonded (stakingInfo?: DeriveStakingAccount, bonded?: boolean | BN[]): [BN, BN[]] {
  let other: BN[] = [];
  let own = BN_ZERO;

  if (Array.isArray(bonded)) {
    other = bonded
      .filter((_, index): boolean => index !== 0)
      .filter((value): boolean => value.gtn(0));

    own = bonded[0];
  } else if (stakingInfo && stakingInfo.stakingLedger && stakingInfo.accountId.eq(stakingInfo.stashId)) {
    own = stakingInfo.stakingLedger.active.unwrap();
  }

  return [own, other];
}

function renderExtended ({ address, balancesAll, withExtended }: Props, t: TFunction): React.ReactNode {
  const extendedDisplay = withExtended === true
    ? DEFAULT_EXTENDED
    : withExtended || undefined;

  if (!extendedDisplay) {
    return null;
  }

  return (
    <div className='column'>
      {balancesAll && extendedDisplay.nonce && (
        <>
          <Label label={t<string>('transactions')} />
          <div className='result'>{formatNumber(balancesAll.accountNonce)}</div>
        </>
      )}
      {extendedDisplay.crypto && (
        <>
          <Label label={t<string>('type')} />
          <CryptoType
            accountId={address}
            className='result'
          />
        </>
      )}
    </div>
  );
}

function renderValidatorPrefs ({ stakingInfo, withValidatorPrefs = false }: Props, t: TFunction): React.ReactNode {
  const validatorPrefsDisplay = withValidatorPrefs === true
    ? DEFAULT_PREFS
    : withValidatorPrefs;

  if (!validatorPrefsDisplay || !stakingInfo || !stakingInfo.validatorPrefs) {
    return null;
  }

  return (
    <>
      <div />
      {validatorPrefsDisplay.unstakeThreshold && (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).unstakeThreshold && (
        <>
          <Label label={t<string>('unstake threshold')} />
          <div className='result'>
            {(stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).unstakeThreshold.toString()}
          </div>
        </>
      )}
      {validatorPrefsDisplay.validatorPayment && (stakingInfo.validatorPrefs.commission || (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment) && (
        (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment
          ? (
            <>
              <Label label={t<string>('commission')} />
              <FormatBalance
                className='result'
                value={(stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment}
              />
            </>
          )
          : (
            <>
              <Label label={t<string>('commission')} />
              <span>{(stakingInfo.validatorPrefs.commission.unwrap().toNumber() / 10_000_000).toFixed(2)}%</span>
            </>
          )
      )}
    </>
  );
}

function renderBalances (props: Props, allAccounts: string[], bestNumber: BlockNumber | undefined, t: TFunction): React.ReactNode {
  const { kpInfo, address, balancesAll, democracyLocks, stakingInfo, withBalance = true, withBalanceToggle = false } = props;
  const balanceDisplay = withBalance === true
    ? DEFAULT_BALANCES
    : withBalance || false;

  if (!bestNumber || !balanceDisplay) {
    return null;
  }
  let appNameAndValue=kpInfo.appName+': '+kpInfo.power+' KP';
  const allItems = (
    <>
      {kpInfo?.map(({appName, power }, index): React.ReactNode => (
        <>
          <Label label={appName+': '+parseFloat(power).toFixed(4)+' KP'} />
        </>
      ))}
    </>
  );

  if (withBalanceToggle) {
    return (
      <>
        <Expander summary={<FormatKP value={kpInfo[0].power} />}>
          <div className='body column'>
            {allItems}
          </div>
        </Expander>
      </>
    );
  }

  return (
    <>
      {allItems}
    </>
  );
}

function AddressInfo (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const { children, className = '', extraInfo, withBalanceToggle, withHexSessionId } = props;

  return (
    <div className={`ui--AddressInfo${className}${withBalanceToggle ? ' ui--AddressInfo-expander' : ''}`}>
      <div className={`column${withBalanceToggle ? ' column--expander' : ''}`}>
        {renderBalances(props, allAccounts, bestNumber, t)}

      </div>
    </div>
  );
}

export default withMulti(
  styled(AddressInfo)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    white-space: nowrap;

    &:not(.ui--AddressInfo-expander) {
      justify-content: center;
    }

    .column {
      justify-content: start;

      &.column--expander {
        width: 17.5rem;

        .ui--Expander {
          width: 100%;

          .summary {
            display: inline-block;
            text-align: right;
            min-width: 12rem;
          }
        }
      }

      &:not(.column--expander) {
        flex: 1;
        display: grid;
        opacity: 1;

        label {
          grid-column: 1;
          padding-right: 0.5rem;
          text-align: right;
          vertical-align: middle;

          .help.circle.icon {
            display: none;
          }
        }

        .result {
          grid-column: 2;

          .icon {
            margin-left: 0;
            margin-right: 0.25rem;
            padding-right: 0 !important;
          }
        }
      }
    }
  `,
  withCalls<Props>(
    ['derive.balances.all', {
      paramName: 'address',
      propName: 'balancesAll',
      skipIf: skipBalancesIf
    }],
    ['derive.staking.account', {
      paramName: 'address',
      propName: 'stakingInfo',
      skipIf: skipStakingIf
    }],
    ['derive.democracy.locks', {
      paramName: 'address',
      propName: 'democracyLocks',
      skipIf: skipStakingIf
    }]
  )
);
