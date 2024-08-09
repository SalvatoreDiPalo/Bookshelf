import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  LinearProgress,
  styled,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState } from 'react';

import { GoogleIdentifier } from '@/models/enum/google-identifier';
import { GoogleList } from '@/models/google-list';
import { Volume } from '@/models/google-volumes';
import { axiosInstance } from '@/utils/axios';
import { env } from '@/utils/env';
import {
  boundingBox,
  centerText,
  outline,
  Scanner,
  useDevices,
} from '@yudiel/react-qr-scanner';

interface AddBookDialogProps {
  open: boolean;
  handleClose: () => void;
}

const TransparentDialog = styled(Dialog)<DialogProps>(() => ({
  '.MuiDialog-container > .MuiPaper-root': {
    backgroundColor: 'transparent',
    backgroundImage: 'unset',
  },
  '.MuiDialogContent-root': {
    overflowY: 'hidden',
    padding: 0,
  },
}));

export const ScannerDialog = ({ open, handleClose }: AddBookDialogProps) => {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>('centerText');

  const [pause, setPause] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case 'outline':
        return outline;
      case 'boundingBox':
        return boundingBox;
      case 'centerText':
        return centerText;
      default:
        return undefined;
    }
  }

  return (
    <TransparentDialog
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      className="bg-transparent"
    >
      <DialogContent>
        <Scanner
          onScan={(result) => alert('Result ' + result)}
          formats={['ean_8', 'ean_13']}
          constraints={{
            deviceId: deviceId,
          }}
          components={{
            audio: true,
            onOff: true,
            torch: true,
            zoom: true,
            finder: true,
            tracker: getTracker(),
          }}
          allowMultiple={true}
          scanDelay={2000}
          paused={pause}
        />
      </DialogContent>
    </TransparentDialog>
  );
};
