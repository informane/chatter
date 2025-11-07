
import { useEffect, useState } from 'react';
import { JSXComponentPropsModal } from '../lib/props';
import { createPortal } from 'react-dom';

export default function Modal(props: JSXComponentPropsModal) {


  const onClose = function () {
    props.onClose();
  }


  if (props.isOpen) {
    return (
      createPortal(
        <>
          <div className='modal-overlay' onClick={onClose}>
          </div>
          <div className='modal'>
            <button className='close-button' onClick={onClose}>⬅</button>
            <div className='modal-inner'>
              {props.children}
            </div>
          </div>
        </>,
        document.body
      )
    )
  }
}
