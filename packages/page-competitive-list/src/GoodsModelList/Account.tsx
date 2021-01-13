// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FormatKP } from '@polkadot/react-query';
import { AccountId } from '@polkadot/types/interfaces';
import { DeriveLeaderboardData, DeriveLeaderBoardItem } from '@polkadot/api-derive/types';


import React, { useEffect} from 'react';
import styled from 'styled-components';
import { AddressSmall} from '@polkadot/react-components';
import {  useApi, useCall } from '@polkadot/react-hooks';


interface Props {
  param2: Array<string>;
  className?: string;
  intoType?: string;
  appId?: string;
  blockNumber?: string;
  modelID?: string;
}





function Account ({ param2 = [], className = '', appId='', intoType='', blockNumber='', modelID='',}: Props): React.ReactElement<Props> | null | any {
 // const { t } = useTranslation();
 // const { theme } = useContext<ThemeDef>(ThemeContext);
 // const { queueExtrinsic } = useContext(StatusContext);
  const api = useApi();

  useEffect((): void => {

  }, []);

  useEffect((): void => {

  }, []);

  let appIdStr: string = '';
  let cycle: string = '';//榜单期数

  if(!!param2 && param2.length > 0 ){

    if( !!param2[2] ){

      console.log("param2[0]:"+param2[0]);//[1000,123190,""]   appId, blockNumber, modelId

      appIdStr = param2[0].toString();

      cycle = param2[1].toString();

    }else{//清空数据，modelId为空的不查,只查模型榜单

      param2[0]='';
      param2[1]='';
      param2[2]='';
    }

  }


  const lb = useCall<DeriveLeaderboardData>(api.api.derive.kp.leaderboardRecord, [param2]);

  let flag = false;
  if( intoType == 'query' && param2[0] == appId && param2[1] == blockNumber && param2[2] == modelID){
    flag = true;
  }else if( intoType == 'default' ){
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

   if( !!board ){
     board.forEach((val, idx, array) => {
       let power: String = '';
        power = (parseFloat(val.power+'') / 100.00 ).toFixed(4).toString()

        let address: AccountId = val.owner
        return (
          <tr className={className}>
            <td className='favorite'>

            </td>
            <td className='address'>
              { val.commodityId }
            </td>
            <td className='address'>
              {  appIdStr }
            </td>
            <td className='address'>
              <AddressSmall value={address} />
            </td>
            <td className='address'>
             {cycle}
            </td>
            <td className='address'>
             {(idx+1)+''}
            </td>
            <td className='address'>
             {status}
            </td>
            <td className='number'>
             <FormatKP
               value={power}
               withSi
             />
            </td>
            <td />
            <td />
            <td />
          </tr>
        );
     });
    }else{
      return (
        <></>
      );
    }
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
