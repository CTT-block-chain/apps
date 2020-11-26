// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary,Button } from '@polkadot/react-components';
import { useApi, useCall , useToggle} from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber, stringToU8a } from '@polkadot/util';
import ProposalCreate from './ProposalCreate';
import Proposals from './Proposals';

import { useTranslation } from '../translate';

const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));

interface Props {
  approvalCount?: number;
  proposalCount?: number;
}

const PM_DIV = new BN(1000000);

function Summary ({ approvalCount, proposalCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<Balance>(api.derive.chain.bestNumber);
  const totalProposals = useCall<BN>(api.query.treasury.proposalCount);
  const treasuryBalance = useCall<DeriveBalancesAccount>(api.derive.balances.account, [TREASURY_ACCOUNT]);
  const spendPeriod = api.consts.treasury.spendPeriod;
  const [isPreimageOpen, togglePreimage] = useToggle();

  const value = treasuryBalance?.freeBalance.gtn(0)
    ? treasuryBalance.freeBalance
    : null;
  const burn = treasuryBalance?.freeBalance.gtn(0) && !api.consts.treasury.burn.isZero()
    ? api.consts.treasury.burn.mul(treasuryBalance?.freeBalance).div(PM_DIV)
    : null;

  return (
    <SummaryBox>
      <section>

      </section>
      <section>

      </section>
      <section>
        {value && (
          <CardSummary label={t<string>('Annual issue')}>
            <FormatBalance
              value={value}
              withSi
            />
          </CardSummary>
        )}
        {burn && (
          <CardSummary
            className='media--1000'
            label={t<string>('Total number of additional issues in model year')}
          >
            <FormatBalance
              value={burn}
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
     <Button.Group>
       <Button
         icon='plus'
         label={t<string>('Submit preimage')}
         onClick={togglePreimage}
       />
       <ProposalCreate />
     </Button.Group>
    </SummaryBox>
  );
}

export default React.memo(Summary);
