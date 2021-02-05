// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveCouncilVote } from '@polkadot/api-derive/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { Label , Expander } from '@polkadot/react-components';
import BN from 'bn.js';
import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';

interface Props {
  powerRatio?: string;
  intoType?: string;
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function LockedVote ({ powerRatio = '', intoType = '',children, className = '', label, params }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = useCall<DeriveCouncilVote>(api.derive.council.votesOf, [params]);

  if (!info?.stake.gtn(0)) {
    return null;
  }
  console.log("LockedVote----intoType:"+intoType);
  if(!!intoType && intoType=='Voters'){
    console.log("stake:"+info?.stake);
    console.log("powerRatio:"+powerRatio);
    var newStake = new BN(0);
    if(!!powerRatio && !!info.stake){
      var a = BigInt(0);
      if(Number(powerRatio)!=1){
        a = BigInt(info.stake+'') * BigInt((Number(parseFloat(powerRatio+'').toFixed(4)+'') * 10000 ) + '') ;
        a = a / BigInt(10000+'');
      }else{
        a = BigInt(info.stake+'') * BigInt(Number(powerRatio) + '') ;
      }
      newStake = new BN(a+'');
    }
    console.log("newStake:"+newStake);
    return (
      <Expander summary={<FormatBalance value={info?.stake} />} >
        <div className='ui--Bonded' style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Label label={powerRatio?(parseFloat(powerRatio+'').toFixed(2) )+'x-':''}/>
          <FormatBalance
            className={className}
            label={label}
            value={newStake}
          >
            {children}
          </FormatBalance>
        </div>
      </Expander>
    );
  }else{
    return (
      <FormatBalance
        className={className}
        label={label}
        value={info?.stake}
      >
        {children}
      </FormatBalance>
    );
  }
}

export default React.memo(LockedVote);
