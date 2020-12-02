// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';

import React from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import ProposalCreate from './ProposalCreate';
import Proposals from './Proposals';
import Summary from './Summary';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

function Overview ({ className, isMember, members }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveTreasuryProposals>(api.derive.treasuryTech.proposals);
  const { t } = useTranslation();
  const [isPreimageOpen, togglePreimage] = useToggle();
  return (
    <div className={className}>
      <Summary
        approvalCount={info?.approvals.length}
        proposalCount={info?.proposals.length}
      />
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Submit preimage')}
          onClick={togglePreimage}
        />
        <ProposalCreate />
      </Button.Group>
      <Proposals
        isMember={isMember}
        members={members}
        proposals={info?.proposals}
      />
      <Proposals
        isApprovals
        isMember={isMember}
        members={members}
        proposals={info?.approvals}
      />
    </div>
  );
}

export default React.memo(Overview);
