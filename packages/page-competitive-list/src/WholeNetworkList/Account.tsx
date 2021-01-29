// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FormatKP } from '@polkadot/react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { DeriveLeaderboardData, DeriveLeaderBoardItem } from '@polkadot/api-derive/types';

import React, { useEffect} from 'react';
import styled from 'styled-components';
import { AddressSmall} from '@polkadot/react-components';
import {  useApi, useCall } from '@polkadot/react-hooks';


//import { useTranslation } from '../translate';

interface Props {
  param2: Array<string>;
  className?: string;
  intoType?: string;
  appId?: string;
  blockNumber?: string;
  modelID?: string;
}





function Account ({ param2 = [], className = '', appId='', intoType='', blockNumber='', modelID='', }: Props): React.ReactElement<Props> | null | any {
 // const { t } = useTranslation();
 // const { theme } = useContext<ThemeDef>(ThemeContext);
  //const { queueExtrinsic } = useContext(StatusContext);
  const api = useApi();

  useEffect((): void => {

  }, []);

  useEffect((): void => {

  }, []);

  let appIdStr: string = '';
  let cycle: string = '';//榜单期数

  if(!!param2 && param2.length > 0){

    appIdStr = param2[0].toString();  //[1000,123190,""]   appId, blockNumber, modelId
    param2[2] = "";  //把 modelId 去掉，只查全网榜单的记录

  }
  console.log("param2:"+JSON.stringify(param2))

  const lb = useCall<DeriveLeaderboardData>(api.api.derive.kp.leaderboardRecord, [param2]);

  console.log("lb:"+JSON.stringify(lb));

  let flag = false;
  if( appId!='' || blockNumber!='' || modelID!=''){
    if( intoType == 'query' && param2[0] == appId && param2[1] == blockNumber && param2[2] == modelID){
      flag = true;
    }else if( intoType == 'default' ){
      flag = true;
    }
  }else{
    flag = true;
  }
  if(flag){
    var board: Array<DeriveLeaderBoardItem>=[];
   // var accounts: Array=[];

    if( !!lb ){
     /* if( !!lb.accounts && lb.accounts.length > 0){
        accounts = lb.accounts;
      } */
      if(!!lb.board && lb.board.length > 0){
        board = lb.board;
      }
    }
    console.log("board:"+JSON.stringify(board));
   // console.log("accounts:"+JSON.stringify(accounts));



    const status = '正常';

    return (
      <>
        {board?.map(({ commodityId, owner, power }, index): React.ReactNode => (

            <tr className={className}>
              <td className='favorite'>

              </td>
              <td className='address'>
                { commodityId }
              </td>
              <td className='address'>
                {  appIdStr }
              </td>
              <td className='address'>

              </td>
              <td className='address'>
                <AddressSmall value={owner} />
              </td>
              <td className='address'>
               { param2[1]+'' }
              </td>
              <td className='address'>
               {(index+1)+''}
              </td>
              <td className='address'>
               {status}
              </td>
              <td className='number'>
               <FormatKP
                 value={(parseFloat(power+'') / 100.00 ).toFixed(4).toString()}
                 withSi
               />
              </td>
              <td />
              <td />
              <td />
            </tr>

        ))
        }
      </>
    );
  }else{
    return (
      <></>
    );
  }
}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
