import { DeriveProposal } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import AccountPowerDisplay from './AccountPower';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function AccountPowers ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  // TODO: read api data
  //const proposals = useCall<DeriveProposal[]>(api.derive.democracy.proposals);
  const powers = undefined;

  const headerRef = useRef([
    [t('account power'), 'start', 2],
    [t('account'), 'address'],
    [undefined, undefined, 2],
    [undefined, 'media--1000']
  ]);

  return (
    <Table
      className={className}
      empty={powers && t<string>('No powers')}
      header={headerRef.current}
    >
      {powers?.map((power): React.ReactNode => (
        <AccountPowerDisplay
          key={power.index.toString()}
          value={power}
        />
      ))}
    </Table>
  );
}

export default React.memo(AccountPowers);