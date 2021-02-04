// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { PowerSize } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceVoting } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import InputBalanceChanges from './InputBalanceChanges';
import { useTranslation } from './translate';

interface Props {
  newIsDisabled?: boolean;
  accountId?: string | null;
  balance?: string;
}

function VoteValue ({ newIsDisabled, accountId , balance=''}: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  let controllerAccountKp: number = 0;

   //console.log("accountId:"+JSON.stringify(accountId))
   var newAccountId = accountId?accountId:'';
   var pow = useCall<PowerSize>(api.derive.kp.accountPower, [newAccountId]);
    console.log("pow:"+pow);
   if(!!accountId){
     if (!!pow) {
       controllerAccountKp = Number(pow+'') / 100.0;
     }
   }
   let powerRatio = useCall<string>(api.derive.kp.powerRatio, [accountId]);
   let powerWeighted : BN = new BN(0);
   if(!!powerRatio && !!balance){
     var a: BigInt;
     if(Number(powerRatio)!=1){
       a= BigInt(balance+'') * BigInt((parseFloat(powerRatio+'').toFixed(4) * 10000 ) + '') ;
       a = a / BigInt(10000+'');
     }else{
       a = BigInt(balance+'') * BigInt(Number(powerRatio) + '') ;
     }
     powerWeighted = new BN(a+'');
     //powerWeighted =  new BN(startBalance+'').muln(Number(powerRatio));
   }
  
   console.log("powerWeighted:"+powerWeighted);

  useEffect((): void => {

  }, [ accountId, api]);

  // only do onChange to parent when the BN value comes in, not our formatted version
  useEffect((): void => {

  }, []);

  return (
    <InputBalanceChanges
      autoFocus
      defaultValue={powerWeighted}
      isDisabled={true}
      help={t<string>("The calculation power weighted value refers to the final value of the mortgage's KPT after calculation power weighted, which is calculated by multiplying the number of KPT by the calculation power weighted multiple.")}
      isError={false}
      label={t<string>('KP weighted value')}
      labelExtra={
        <span className='label'>{t<string>('KPValue')}{controllerAccountKp?controllerAccountKp+' KP':''} </span>
      }
    />
  );
}

export default React.memo(VoteValue);
