// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../types';

import React, { useCallback, useState } from 'react';
import { Button, Input, Select, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
//import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';
//import useProxies from '../Accounts/useProxies';

interface Props extends ModalProps {
  valueList?: Array<string>;
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;

  changeQueryStatus: (status: boolean) => void;
  changeAppId: (appId: Number) => void;
  changeBlockNumber: (blockNumber: string) => void;
  changeModelID: (modelID: string) => void;
}

/* interface CreateOptions {
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
} */

function handleChange(event) {
  console.log(event.target.value)
}


function ProxyAdd ({ valueList = [''], className = '', onClose, onStatusChange, changeQueryStatus, changeAppId, changeBlockNumber, changeModelID}: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const { t } = useTranslation();

 const [{ isAppIdValid, appId }, setAppId] = useState({ isAppIdValid: false, appId: 0 });
 const [{ isBlockNumberValid, blockNumber }, setBlockNumber] = useState({ isBlockNumberValid: false, blockNumber: '' });
 const [{ isModelIDValid, modelID }, setModelID] = useState({ isModelIDValid: false, modelID: '' });

 //const [stashAddress, setStashAddress] = useState<string | null>(null);
 // const { hasOwned } = useProxies(stashAddress);
  //changeBlockNumber(valueList[0]);

  const _createProxied = useCallback(
    (): void => {
      onClose();
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, changeQueryStatus, changeAppId, changeBlockNumber, changeModelID, t]
  );

  const _onChangeAppId = useCallback(
    (appId: string): void=> {
      changeQueryStatus(true);
      var appId_num = (Number)(appId+'');
      changeAppId(appId_num);
      setAppId({ isAppIdValid: true, appId: appId_num })
    },
    []
  );
  const _onChangeBlockNumber = useCallback(
    (blockNumber: string) : void=> {
      changeQueryStatus(true);
      changeBlockNumber(blockNumber);
      setBlockNumber({ isBlockNumberValid: true, blockNumber: blockNumber })
    },
    []
  );
  const _onChangeModelID = useCallback(
    (modelID: string) : void=> {
      changeQueryStatus(true);
      changeModelID(modelID);
      setModelID({ isModelIDValid: true, modelID: modelID })
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
              value={appId+''}
              className='full'
              help={t<string>('Enter the Application ID of the token you want to search.')}
              isError={isAppIdValid}
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
              <Select
                valueList={valueList}
                className='full'
                help={t<string>('Enter the Block Number of the token you want to search.')}
                label={t<string>('Block Number')}
                isError={isBlockNumberValid}
                onChange={_onChangeBlockNumber}
              >

              </Select>

          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              value={modelID}
              className='full'
              help={t<string>('Enter the Model ID of the token you want to search.')}
              isError={isModelIDValid}
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
