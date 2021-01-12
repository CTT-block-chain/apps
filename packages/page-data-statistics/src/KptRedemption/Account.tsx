// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
//import { DeriveAccountPowers} from '@polkadot/api-derive/types';
import styled from 'styled-components';

import BN from 'bn.js';
import React, {  useEffect} from 'react';
//import styledfrom 'styled-components';
import { FormatBalance } from '@polkadot/react-query';
import { AddressSmall} from '@polkadot/react-components';
import {  useApi, useCall } from '@polkadot/react-hooks';
import { useTranslation } from '../translate';

//import {formatBalance } from '@polkadot/util';
interface Props {
  account: string;
  appId?: string;
  modelId?: string;
  status?: string;
  className?: string;
  filter?: string;
  createReward: string;
}

function Account ({ account = '', className = '', appId = '', modelId = '', status = '', createReward = '', filter }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  //const { theme } = useContext<ThemeDef>(ThemeContext);
 // const { queueExtrinsic } = useContext(StatusContext); */
  const api = useApi();
  const bestNumber = useCall<BN>(api.api.derive.chain.bestNumber);

  useEffect((): void => {

  }, [account, api]);

  useEffect((): void => {

  }, [account, api, bestNumber]);



 /*  */
  return (
    <tr className={className}>
      <td className='favorite'>

      </td>
      <td className='address'>
        {modelId+''}
      </td>
      <td className='address'>
        <AddressSmall value={account+''} />
      </td>

      <td className='address'>
        {appId+''}
      </td>
      <td className='address'>
        {t<string>(status)}
      </td>
      <td className='address'>

      </td>
      <td className='number'>
         {<FormatBalance className='result' value={BigInt(createReward)} />}

      </td>
      <td className='number'>

      </td>
      <td />
      <td />
      <td />
    </tr>
  );
}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
