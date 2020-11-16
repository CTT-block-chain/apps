// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import { AddressMini, Button, Expander, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
	// TODO: DeriveAccountPower
  //value: DeriveProposal;
}

function AccountPower ({ className = '', value: { power, index, account, } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  
  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      
    </tr>
  );
}

export default React.memo(styled(AccountPower)`
  .identityIcon {
    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      margin-bottom: 4px;
    }
  }
`);
