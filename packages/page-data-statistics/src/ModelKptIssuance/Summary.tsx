// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { DeriveBalancesAccount,DeriveModelCycleRewardTime } from '@polkadot/api-derive/types';
//import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber , stringToU8a} from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

const TRMODEL_ACCOUNT = stringToU8a('modlpy/trmod'.padEnd(32, '\0'));//模型

interface Props {
  referendumCount?: number;
}


function Summary ({ referendumCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  //const publicPropCount = useCall<BN>(api.query.democracy.publicPropCount);
 // const referendumTotal = useCall<BN>(api.query.democracy.referendumCount);

  const trmodelBalance = useCall<DeriveBalancesAccount>(api.derive.balances.account, [TRMODEL_ACCOUNT]);

  const value_tr = trmodelBalance?.freeBalance.gtn(0)
     ? trmodelBalance.freeBalance
     : null;
  /* const burn = treasuryBalance?.freeBalance.gtn(0) && !api.consts.treasury.burn.isZero()
     ? api.consts.treasury.burn.mul(treasuryBalance?.freeBalance).div(PM_DIV)
     : null; */
  //模型增发基存量=模型创建基金余额
     let fundStock_tr = BigInt(1);
     if(!!value_tr){
       fundStock_tr=BigInt(value_tr+'');
       //console.log("fundStock:"+fundStock);
     }
     //模型增发基金发行量=3亿-基金存量
     let initial_issue_quantity_tr = BigInt('30000000000000000000000');
     if(!!fundStock_tr){
       initial_issue_quantity_tr=initial_issue_quantity_tr-fundStock_tr;
      // console.log("initial_issue_quantity_tr:"+initial_issue_quantity_tr);
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
        <CardSummary label={t<string>('Total issues (year)')}>
          {formatNumber(activeProposals?.length)}
        </CardSummary>
      </section>
      <section>
         {
           initial_issue_quantity_tr
         ?
         (
           <CardSummary className='media--1000' label={t<string>('Initial issue quantity of model Additional')}>
             <FormatBalance
               value={initial_issue_quantity_tr}
               withSi
             />
           </CardSummary>
         )
         :
         (
           <CardSummary label={t<string>('Initial issue quantity of model Additional')}>
             <FormatBalance
               value={0}
               withSi
             />
           </CardSummary>
         )

         }
      </section>
      <section>

        {fundStock_tr && (
          <CardSummary
            className='media--1000'
            label={t<string>('Total model Additional balance')}
          >
            <FormatBalance
              value={fundStock_tr}
              withSi
            />
          </CardSummary>
        )}
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
