import React, { createContext } from 'react';
import { AlertComponentPropsWithStyle, AlertManager, useAlert } from 'react-alert';
import { BrandColor } from "../utils/Colors"
import SohoButton from './SohoButton';

export const SohoAlertContext = createContext<AlertManager | undefined>(undefined)
export const useSohoAlert = () => useAlert(SohoAlertContext)

export const SohoAlertTemplate: React.ComponentType<AlertComponentPropsWithStyle> = ({ style, options, message, close, }) => {
  console.log(options)
  return (
    <SohoAlert
      onAccept={() => {}}
      onClose={() => {}}
      body={() => message} />
  )
}

export const SohoAlert = ({ onAccept, onClose, body }: { body: () => React.ReactNode, onAccept: () => void, onClose: () => void }) => {

  return (
    <div style={{ border: `1px solid ${BrandColor}`, borderRadius: '25px', marginBottom: '0.5rem' }}>
      <div style={{ backgroundColor: BrandColor, padding: "1rem", borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
        <p style={{ color: 'white', margin: 0 }}>
          {body()}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: "1rem", backgroundColor: 'white', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <SohoButton
          onClick={() => {
            onAccept()
          }}
          value="Accept"
        />
        <SohoButton
          onClick={() => {
            onClose()
          }}
          value="Decline"
        />
      </div>
    </div>
  )
}