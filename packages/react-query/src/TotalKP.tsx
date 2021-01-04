// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import FormatKP from './FormatKP';
import { DeriveAccountPowers } from '@polkadot/api-derive/types';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function TotalIssuance ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const totalPower = useCall<PowerSize>(api.query.kp.totalPower);
  console.log('totalPower:', totalPower?.toJSON());
  /*const totalValue=Number("1");
   if(!!totalPower){
    totalValue=Number(totalPower)/100;
    console.log('totalPower22:', totalValue);
  } */
  return (
    <div className={className}>
      {label || ''}
      <FormatKP
        value={totalPower}
        withSi
      />
      {children}
    </div>
  );
}

export default React.memo(TotalIssuance);
