// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAppFinanceCountInfo} from '@polkadot/api-derive/types';

//import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
//import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
//import { formatNumber } from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';


interface Props {
   redeemCount?: number;
   income?: BN;
}


function Summary ({ redeemCount = 0, income }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
 // const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  //const publicPropCount = useCall<BN>(api.query.democracy.publicPropCount);
  //const referendumTotal = useCall<BN>(api.query.democracy.referendumCount);


  var totalSeconds = new BN(300);//当前周期设置为30分钟

 const appFinanceCountInfo = useCall<DeriveAppFinanceCountInfo>(api.derive.kp.appFinanceCountInfo);
 console.log("appFinanceCountInfo:" + JSON.stringify(appFinanceCountInfo));

  var currentSeconds = new BN(1);
  //var count: number = 0;
  var totalBurn = new BN(0);
  let stage: Number = 0;
  if(!!appFinanceCountInfo){
     stage = appFinanceCountInfo.stage;
     if( stage == 0 ){
       totalSeconds = new BN(0);
       currentSeconds = new BN('0');
     }else if( stage == 1 ){
       totalSeconds = new BN(300);
       currentSeconds = new BN((300-Number(appFinanceCountInfo.leftSeconds+''))+'');
     }else if( stage == 2 ){
       totalSeconds = new BN(450);
       currentSeconds = new BN((450-Number(appFinanceCountInfo.leftSeconds+''))+'');
     }else if( stage == 3 ){
       totalSeconds = new BN(150);
       currentSeconds = new BN((150-Number(appFinanceCountInfo.leftSeconds+''))+'');
     }

     console.log("totalBurn:"+appFinanceCountInfo.totalBurn);
    // count = Number(appFinanceCountInfo.count+'');
   //  totalBurn = new BN(appFinanceCountInfo.totalBurn+'');//未格式化
    var a: string = appFinanceCountInfo.totalBurn.toString().substring(0,appFinanceCountInfo.totalBurn.toString().length-4)+'';
    console.log("a:"+a);
    totalBurn = new BN(Number(a)+'');
  }



  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('Number of redemption periods')}>
          {redeemCount}
        </CardSummary>
      </section>
      <section>
         {
           appFinanceCountInfo
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
               value={totalBurn}
               withSi
             />
           </CardSummary>
         )

         }
      </section>

      {bestNumber && (stage == 0 ) &&(
        <section className='media--1100'>

        </section>
      )}
      {bestNumber && (stage == 1 ) &&(
        <section className='media--1100'>
          <CardSummary
            label={t<string>('Redemption period')}
            progress={{
              total: totalSeconds ,
              value: bestNumber.mod(currentSeconds?currentSeconds:new BN(0)).addn(1),
              withTime: true
            }}
          />
        </section>
      )}
      {bestNumber && (stage == 2 ) &&(
        <section className='media--1100'>
          <CardSummary
            label={t<string>('confirming')}
            progress={{
              total: totalSeconds ,
              value: bestNumber.mod(currentSeconds?currentSeconds:new BN(0)).addn(1),
              withTime: true
            }}
          />
        </section>
      )}
      {bestNumber && (stage == 3 ) &&(
        <section className='media--1100'>
          <CardSummary
            label={t<string>('compensating')}
            progress={{
              total: totalSeconds ,
              value: bestNumber.mod(currentSeconds?currentSeconds:new BN(0)).addn(1),
              withTime: true
            }}
          />
        </section>
      )}

    </SummaryBox>
  );
}

export default React.memo(Summary);
