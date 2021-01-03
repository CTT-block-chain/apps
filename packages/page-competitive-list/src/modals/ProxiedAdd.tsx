// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../types';

import React, { useCallback, useState } from 'react';
import { Button, Input, InputAddressSimple, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';
import useProxies from '../Accounts/useProxies';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;

  changeQueryStatus: (status: boolean) => void;
  changeAppId: (appId: int) => void;
  changeBlockNumber: (blockNumber: string) => void;
  changeModelID: (modelID: string) => void;
}

interface CreateOptions {
  genesisHash?: string;
  name: string;
  tags?: string[];
}

function createProxy (address: string, { genesisHash, name, tags = [] }: CreateOptions, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    keyring.addExternal(address, { genesisHash, isProxied: true, name, tags });

    status.account = address;
    status.status = 'success';
    status.message = success;
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

function ProxyAdd ({ className = '', onClose, onStatusChange, changeQueryStatus, changeAppId, changeBlockNumber, changeModelID}: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const { t } = useTranslation();

  const [{ isAppIdValid, appId }, setAppId] = useState({ isAppIdValid: false, appId: 0 });
  const [{ isBlockNumberValid, blockNumber }, setBlockNumber] = useState({ isBlockNumberValid: false, blockNumber: '' });
  const [{ isModelIDValid, modelID }, setModelID] = useState({ isModelIDValid: false, modelID: '' });

  const [stashAddress, setStashAddress] = useState<string | null>(null);
  const { hasOwned } = useProxies(stashAddress);

  const _createProxied = useCallback(
    (): void => {
      onClose();
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, changeQueryStatus, changeAppId, changeBlockNumber, changeModelID, stashAddress, t]
  );

  const _onChangeAppId = useCallback(
    (appId: int): void=> {
      changeQueryStatus(true);
      changeAppId(appId);
      setAppId({ isAppIdValid: true, appId })
    },
    []
  );
  const _onChangeBlockNumber = useCallback(
    (blockNumber: string) : void=> {
      changeQueryStatus(true);
      changeBlockNumber(blockNumber);
      setBlockNumber({ isBlockNumberValid: true, blockNumber })
    },
    []
  );
  const _onChangeModelID = useCallback(
    (modelID: string) : void=> {
      changeQueryStatus(true);
      changeModelID(modelID);
      setModelID({ isModelIDValid: true, modelID })
    },
    []
  );
  return (
    <Modal
      className={className}
      header={t<string>('List query')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <Input
              className='full'
              help={t<string>('Enter the Application ID of the token you want to search.')}
              isError={false}
              label={t<string>('AppId')}
              onChange={_onChangeAppId}
              placeholder={t<string>('AppId')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              className='full'
              help={t<string>('Enter the Block Number of the token you want to search.')}
              label={t<string>('Block Number')}
              onChange={_onChangeBlockNumber}
              placeholder={t<string>('Block Number')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              className='full'
              help={t<string>('Enter the Model ID of the token you want to search.')}
              isError={false}
              label={t<string>('Model ID')}
              onChange={_onChangeModelID}
              placeholder={t<string>('Model ID')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('')}</p>
          </Modal.Column>
        </Modal.Columns>

      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='check'
          isDisabled={false}
          label={t<string>('Submit')}
          onClick={_createProxied}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ProxyAdd);
