// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAppFinanceCountInfo,DeriveModelCycleRewardTime} from '@polkadot/api-derive/types';

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
  income?: number;
}


function Summary ({ redeemCount = 0, income = 0 }: Props): React.ReactElement<Props> {//referendumCount ,
  const { t } = useTranslation();
  const { api } = useApi();
 // const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  //const publicPropCount = useCall<BN>(api.query.democracy.publicPropCount);
  //const referendumTotal = useCall<BN>(api.query.democracy.referendumCount);



  const appFinanceCountInfo = useCall<DeriveAppFinanceCountInfo>(api.derive.kp.appFinanceCountInfo);
 //console.log("appFinanceCountInfo:" + JSON.stringify(appFinanceCountInfo));

 //var currentSeconds = new BN(1);
  //var count: number = 0;
  var totalBurn = new BN(0);
  if(!!appFinanceCountInfo){
    // currentSeconds = new BN((300-Number(appFinanceCountInfo.leftSeconds+''))+'');
    // count = Number(appFinanceCountInfo.count+'');
   //  totalBurn = new BN(appFinanceCountInfo.totalBurn+'');//未格式化
    var a: string = appFinanceCountInfo.totalBurn.toString().substring(0,appFinanceCountInfo.totalBurn.toString().length-4)+'';
    console.log("a:"+a);
    totalBurn = new BN(Number(a)+'');
  }
  var total2 = new BN(600);//当前周期设置为1小时
  const modelCycleRewardStage = useCall<DeriveModelCycleRewardTime>(api.derive.kp.modelCycleRewardStage);

  //console.log("modelCycleRewardStage:" + JSON.stringify(modelCycleRewardStage));

  var total = new BN(1);
  let stage: Number = 0;
  if(!!modelCycleRewardStage){
     stage = modelCycleRewardStage.stage.toNumber();
     if(stage==0){
       total = new BN((300-modelCycleRewardStage.leftSeconds)+'');
       total2 = new BN(300);
     }else if(stage==1 || stage==2){
       total = new BN((100-modelCycleRewardStage.leftSeconds)+'');
       total2 = new BN(100);
     }
    // console.log("total:" + total);
    // console.log("stage:" + stage);
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
      <section>
      </section>

     {bestNumber && (stage == 0 ) &&(
       <section className='media--1100'>
         <CardSummary
           label={t<string>('ordinary stage')}
           progress={{
             total: total2 ,
             value: bestNumber.mod(total).addn(1),
             withTime: true
           }}
         />
       </section>
     )}
     {bestNumber && (stage == 1 ) &&(
       <section className='media--1100'>
         <CardSummary
           label={t<string>('statistical income stage')}
           progress={{
             total: total2 ,
             value: bestNumber.mod(total).addn(1),
             withTime: true
           }}
         />
       </section>
     )}
     {bestNumber && (stage == 2 ) &&(
       <section className='media--1100'>
         <CardSummary
           label={t<string>('apply for award stage')}
           progress={{
             total: total2 ,
             value: bestNumber.mod(total).addn(1),
             withTime: true
           }}
         />
       </section>
     )}

    </SummaryBox>
  );
}

export default React.memo(Summary);
