// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber, stringToU8a } from '@polkadot/util';

import { useTranslation } from '../translate';

const TREASURY_ACCOUNT = stringToU8a('modlpy/trtch'.padEnd(32, '\0'));

interface Props {
  approvalCount?: number;
  proposalCount?: number;
}

const PM_DIV = new BN(1000000);

function Summary ({ approvalCount, proposalCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<Balance>(api.derive.chain.bestNumber);
  const totalProposals = useCall<BN>(api.query.treasuryTech.proposalCount);
  const treasuryBalance = useCall<DeriveBalancesAccount>(api.derive.balances.account, [TREASURY_ACCOUNT]);
  const spendPeriod = api.consts.treasuryTech.spendPeriod;

  const value = treasuryBalance?.freeBalance.gtn(0)
    ? treasuryBalance.freeBalance
    : null;
  const burn = treasuryBalance?.freeBalance.gtn(0) && !api.consts.treasuryTech.burn.isZero()
    ? api.consts.treasuryTech.burn.mul(treasuryBalance?.freeBalance).div(PM_DIV)
    : null;

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('proposals')}>
          {formatNumber(proposalCount)}
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {formatNumber(totalProposals || 0)}
        </CardSummary>
        <CardSummary label={t<string>('pass')}>
          {formatNumber(approvalCount)}
        </CardSummary>
      </section>
      <section>
        {value && (
          <CardSummary label={t<string>('Total funds (kpt)')}>
            <FormatBalance
              value={value}
              withSi
            />
          </CardSummary>
        )}
        {burn && (
          <CardSummary
            className='media--1000'
            label={t<string>('Surplus (kpt)')}
          >
            <FormatBalance
              value={burn}
              withSi
            />
          </CardSummary>
        )}
      </section>
      {bestNumber && spendPeriod?.gtn(0) && (
        <section>
          <CardSummary
            label={t<string>('Start up period')}
            progress={{
              total: spendPeriod,
              value: bestNumber.mod(spendPeriod),
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
