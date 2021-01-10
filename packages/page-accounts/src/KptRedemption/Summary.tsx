// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAccountPowers} from '@polkadot/api-derive/types';

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber , stringToU8a} from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';


interface Props {
  referendumCount?: number;
}


function Summary ({ referendumCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const publicPropCount = useCall<BN>(api.query.democracy.publicPropCount);
  const referendumTotal = useCall<BN>(api.query.democracy.referendumCount);


  var totalSeconds = new BN(300);//当前周期设置为30分钟

 const appFinanceCountInfo = useCall<DeriveAppFinanceCountInfo>(api.derive.kp.appFinanceCountInfo);
 console.log("appFinanceCountInfo:" + JSON.stringify(appFinanceCountInfo));

  var currentSeconds = new BN(1);
  var count: int = 0;
  var totalBurn = BigInt(1);
  if(!!appFinanceCountInfo){
     currentSeconds = new BN((300-appFinanceCountInfo.leftSeconds)+'');
     count = appFinanceCountInfo.count;
     totalBurn = BigInt(appFinanceCountInfo.totalBurn+'');

     console.log("currentSeconds:" + currentSeconds);
     console.log("count:" + count);
     console.log("totalBurn:" + totalBurn);
  }



  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('Number of redemption periods')}>
          {formatNumber(count)}
        </CardSummary>
      </section>
      <section>
         {
           totalBurn
         ?
         (
           <CardSummary className='media--1000' label={t<string>('Total redemption')}>
             <FormatBalance
               value={totalBurn}
               withSi
             />
           </CardSummary>
         )
         :
         (
           <CardSummary label={t<string>('Total redemption')}>
             <FormatBalance
               value={0}
               withSi
             />
           </CardSummary>
         )

         }
      </section>
      <section>
      </section>

      {bestNumber &&(
        <section className='media--1100'>
          <CardSummary
            label={t<string>('Redemption period')}
            progress={{
              total: totalSeconds ,
              value: bestNumber.mod(currentSeconds).addn(1),
              withTime: true
            }}
          />
        </section>
      )}

    </SummaryBox>
  );
}

export default React.memo(Summary);
