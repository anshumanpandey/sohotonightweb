import Color from 'color';
import React, { useEffect, useState } from 'react';
import { BrandColor } from "../utils/Colors"
import SohoButton from './SohoButton';
import SohoLoader from './SohoLoader';

export const SohoAlert = ({ onAccept, onClose, body, disable = false, busy = false, autoCloseOnSeconds }: { autoCloseOnSeconds?: number, busy?: boolean, disable?: boolean, body: () => React.ReactNode, onAccept: () => void, onClose: () => void }) => {
  const [timer, setTimer] = useState<undefined | NodeJS.Timeout>()
  const [timeElapse, setTimeElapse] = useState<number>(0)

  const onTick = () => {
    setTimeElapse(p => {
      if (p == autoCloseOnSeconds) {
        onClose()
        if (timer) {
          clearInterval(timer)
        }
      }

      return p + 1
    })
  }

  useEffect(() => {
    if (!autoCloseOnSeconds) return
    if (busy) return
    if (timer) return

    const t = setInterval(() => {
      onTick()
    }, 1000)

    setTimer(t)
  }, [autoCloseOnSeconds])

  useEffect(() => {
    if (!timer) return

    if (busy === true) {
      clearInterval(timer)
    }
  }, [busy])


  const isDisabled = () => disable === true || busy === true

  return (
    <div style={{ border: `1px solid ${BrandColor}`, backgroundColor: 'white',borderRadius: '25px', marginBottom: '0.5rem', position: 'relative' }}>
      <SohoLoader show={busy} />
      <div style={{ backgroundColor: BrandColor, padding: "1rem", borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
        <p style={{ color: 'white', margin: 0 }}>
          {body()}
        </p>
      </div>
      {autoCloseOnSeconds && (
        <div
          style={{ height: 3, backgroundColor: Color(BrandColor).darken(0.2).toString(), width: `${(timeElapse / autoCloseOnSeconds) * 100}%` }}></div>
      )}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: "1rem", backgroundColor: 'white', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <SohoButton
          disabled={isDisabled()}
          onClick={() => {
            onAccept()
          }}
          value="Accept"
        />
        <SohoButton
          disabled={isDisabled()}
          onClick={() => {
            onClose()
          }}
          value="Decline"
        />
      </div>
    </div>
  )
}