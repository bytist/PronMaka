import { GlobalMessageConfig, GlobalMessageType } from '@spartacus/core';

export function makaGlobalMessageConfigFactory(): GlobalMessageConfig {
  return {
    globalMessages: {
      [GlobalMessageType.MSG_TYPE_CONFIRMATION]: {
        timeout: 8000,
      },
      [GlobalMessageType.MSG_TYPE_INFO]: {
        timeout: 8000,
      },
      [GlobalMessageType.MSG_TYPE_ERROR]: {
        timeout: 8000,
      },
      [GlobalMessageType.MSG_TYPE_WARNING]: {
        timeout: 8000,
      },
    },
  };
}
