// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { Button, Icon,AddressInfo,AddressMini, AddressSmall, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Council from './Council';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  onRespond: () => void;
  proposal: DeriveTreasuryProposal;
  withSend: boolean;
}

function ProposalDisplay ({ className = '', isMember, members, proposal: { council, id, proposal }, withSend }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const hasProposals = useMemo(
    () => !!council
      .map(({ votes }) => votes ? votes.index.toNumber() : -1)
      .filter((index) => index !== -1)
      .length,
    [council]
  );
  const address ='暂无用户数据';
  const testValue1 ='120,000,235,08';
  const testValue2 ='2,000,000.00 KPT';
  const testValue3 ='120';
  const testValue4 ='2';
  const testValue5='4天3小时';
  const testValue6='#279,438';
  return (
    <tr className={className}>
      <td className='number'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <td className='address'>
        <AddressSmall value={proposal.proposer} />
      </td>

      <td className='address'>
        {testValue1}
      </td>
      <td className='address'>
        {testValue2}
      </td>
      <td className='address'>
        {testValue3}
      </td>
      <td className='address'>
        {testValue4}
      </td>
      <td className='address'>
        {testValue5}<br/>
        {testValue6}
      </td>
      <td className='address'>

      </td>
      <td className={hasProposals ? 'middle' : 'button'}>
        {
        /*  hasProposals
          ? <a href='#/council/motions'>{t('Voting')}</a>
          : withSend && (
            <Council
              id={id}
              isDisabled={!isMember}
              members={members}
            />
          ) */
        }
      </td>
      <td className='button'>
        <Button.Group>

        </Button.Group>
      </td>
      <td className='badge'>
        <Icon
          color={hasProposals ? (hasVotedAye ? 'green' : 'red') : 'gray'}
          icon='asterisk'
        />
      </td>
      <td className='links'>

      </td>
    </tr>
  );
}

export default React.memo(ProposalDisplay);
