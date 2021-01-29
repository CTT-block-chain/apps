import React, { useCallback, useState } from 'react';
import Labelled from './Labelled';
import {isUndefined } from '@polkadot/util';

interface Props {
  valueList?: Array<string>;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string | null;
  help?: React.ReactNode;
  icon?: React.ReactNode;
  inputClassName?: string;
  isAction?: boolean;
  isDisabled?: boolean;
  isEditable?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isReadOnly?: boolean;
  isWarning?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  name?: string;
  onChange?: (value: string) => void;
  value?: string | null;
  withLabel?: boolean;
  withEllipsis?: boolean;
}

function Select ({ valueList = [''], children, className, defaultValue, help, icon, inputClassName,
 isAction = false, isDisabled = false, isEditable = false,
 isError = false, isFull = false, isHidden = false,  isReadOnly = false, isWarning = false, label,
 labelExtra, name,  onChange,  value, withEllipsis, withLabel }: Props): React.ReactElement<Props> {

  console.log("valueList:" + JSON.stringify(valueList));
  //valueList.push("123456");

  let counter = 0;
  const [stateName] = useState(`in_${counter++}_at_${Date.now()}`);

  const _onChange = useCallback(
    ({ target }: React.SyntheticEvent<HTMLSelectElement>): void =>
      onChange && onChange((target as HTMLSelectElement).value),
    [onChange]
  );

  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      label={label}
      labelExtra={labelExtra}
      withEllipsis={withEllipsis}
      withLabel={withLabel}
    >
      <select
        style={{ width: '100%',height:'70px',padding:'0em 1em',}}
        className={className}
        onChange={_onChange}
        hidden={isHidden}
        readOnly={isReadOnly}
        name={name || stateName}
        disabled={isDisabled}
        defaultValue={
          isUndefined(value)
            ? (defaultValue || '')
            : undefined
        }
        className={[
          isEditable
            ? 'ui--Input edit icon'
            : 'ui--Input',
          isWarning && !isError
            ? 'isWarning'
            : ''
        ].join(' ')}
      >
       {valueList && valueList.map((va, index): React.ReactNode => (
          <option value={va} key={index}> {va} </option>
        ))
       }
      </select>
      {icon}
      {children}
    </Labelled>
  );
}

export default React.memo(Select);
