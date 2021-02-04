// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveStakingAccount } from '@polkadot/api-derive/types';

import { Label , Expander} from '@polkadot/react-components';
import BN from 'bn.js';
import { useApi, useCall } from '@polkadot/react-hooks';
import React from 'react';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingBonded ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {
  const balance = stakingInfo?.stakingLedger?.active.unwrap();
  const { api } = useApi();

  if (!balance?.gtn(0)) {
    return null;
  }
  //console.log("stakingInfo:",JSON.stringify(stakingInfo));
  var powerRatio = useCall<string>(api.derive.kp.powerRatio, [stakingInfo.accountId]);
  var newBalance = new BN(0);
  
  if(!!powerRatio && !!balance){
    var a: BigInt = BigInt(0);
    if(Number(powerRatio)!=1){
      a = BigInt(balance+'') * BigInt((parseFloat(powerRatio+'').toFixed(4) * 10000  ) + '') ;
      a = a / BigInt(10000+'');
    }else{
      a = BigInt(balance+'') * BigInt(Number(powerRatio) + '') ;
    }
    newBalance = new BN(a+'');
  }



  return (
    <Expander summary={<FormatBalance value={balance} />}>
      {newBalance && (
       <div className='ui--Bonded' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
         <Label label={powerRatio?(parseFloat(powerRatio+'').toFixed(2))+'x-':''}/>
         <FormatBalance className={className} value={newBalance} />
       </div>
      )}
    </Expander>
  );
}

export default React.memo(StakingBonded);
