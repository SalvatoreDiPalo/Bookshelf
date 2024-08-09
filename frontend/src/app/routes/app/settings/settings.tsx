import { Box, Typography } from '@mui/material';

import StatesList from '@/features/settings/states-list';
import {
  boundingBox,
  centerText,
  outline,
  Scanner,
  useDevices,
} from '@yudiel/react-qr-scanner';
import { useState } from 'react';

export default function Settings() {
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
    <Box>
      <Typography variant="h6" gutterBottom>
        States
      </Typography>
      <StatesList />

      <Scanner
        onScan={(result) => console.log(result)}
        formats={[
          'qr_code',
          'micro_qr_code',
          'rm_qr_code',
          'maxi_code',
          'pdf417',
          'aztec',
          'data_matrix',
          'matrix_codes',
          'dx_film_edge',
          'databar',
          'databar_expanded',
          'codabar',
          'code_39',
          'code_93',
          'code_128',
          'ean_8',
          'ean_13',
          'itf',
          'linear_codes',
          'upc_a',
          'upc_e',
        ]}
        constraints={{
          deviceId: deviceId,
        }}
        components={{
          audio: true,
          onOff: true,
          torch: true,
          zoom: true,
          finder: true,
          tracker: centerText,
        }}
        allowMultiple={true}
        scanDelay={2000}
        paused={pause}
      />
    </Box>
  );
}
