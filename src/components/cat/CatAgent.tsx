"use client";

import { useRef } from "react";
import { AnimatePresence } from "motion/react";
import { PixelCat } from "./PixelCat";
import { ChatDialog } from "./ChatDialog";
import { useCatState } from "./useCatState";

/**
 * Mounts the whole pixel-cat system (DESIGN_SPEC §10): the fixed cat plus its
 * dialog, sharing one state machine. The cat hides while the dialog is open
 * (the dialog occupies the same corner); closing returns focus to the cat (§9).
 */
export function CatAgent() {
  const { state, open, isMobile, setBusy, setHovering, openDialog, closeDialog } =
    useCatState();
  const catButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    closeDialog();
    setBusy(false);
    // Return focus to the trigger (§9).
    setTimeout(() => catButtonRef.current?.focus(), 0);
  };

  return (
    <>
      {!open && (
        <PixelCat
          state={state}
          size={isMobile ? 76 : 104}
          isMobile={isMobile}
          onClick={openDialog}
          onHoverChange={setHovering}
          buttonRef={catButtonRef}
        />
      )}

      <AnimatePresence>
        {open && (
          <ChatDialog
            isMobile={isMobile}
            onClose={handleClose}
            onBusyChange={setBusy}
          />
        )}
      </AnimatePresence>
    </>
  );
}
