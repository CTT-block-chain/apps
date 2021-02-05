// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
//import { DeriveAccountPowers } from '@polkadot/api-derive/types';
import styled from 'styled-components';

//import BN from 'bn.js';
import React, {  useEffect } from 'react';
//import styled from 'styled-components';
//import { FormatBalance } from '@polkadot/react-query';
import { AddressInfoAddress} from '@polkadot/react-components';
//import { useApi} from '@polkadot/react-hooks';
//import { useTranslation } from '../translate';

interface Props {
  adminAccount?: Array<string>;
  appId?: Number;
  appName?: string;
  identityAccount?: Array<string>;
  returnRate?: Number;
  stake?: Number;
  className?: string;
}

function Account ({ adminAccount = [''], appId = 0, appName = '' , identityAccount = [''], returnRate = 0, stake=0, className = ''}: Props): React.ReactElement<Props> | null {
  //const { t } = useTranslation();
  //const { theme } = useContext<ThemeDef>(ThemeContext);
  //const { queueExtrinsic } = useContext(StatusContext);
 // const api = useApi();

  useEffect((): void => {

  }, []);

  useEffect((): void => {

  }, []);

  var displayName: string = '帐户数';
   return (
     <tr className={className}>
       <td className='favorite'>

       </td>
       <td className='address'>
         {appName}
       </td>

       <td className='address'>
         {
           appId+''
           /*
           这里必须变成字符串，不然会报错
           */
         }
       </td>
       <td className='address'>
         {returnRate+'%'}
       </td>
       <td className='address'>
          <AddressInfoAddress
            isformat={false}
            displayName={displayName}
            addressInfo={adminAccount}
            withBalance
            withBalanceToggle
            withExtended={false}
          />
       </td>
       <td className='address'>
          <AddressInfoAddress
            isformat={false}
            displayName={displayName}
            addressInfo={identityAccount}
            withBalance
            withBalanceToggle
            withExtended={false}
          />
       </td>
       <td className='number'>
         {stake+''}
       </td>
      <td  className='address'/>
      <td  />
       <td  />
        <td  />
     </tr>

   );

}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
