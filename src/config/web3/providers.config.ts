import { InjectedConnector } from '@web3-react/injected-connector';
import { ConnectorType } from '../network/enums/connector-type.enum';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { CHAIN_ID } from '../constants';

const supportedChainIds = [CHAIN_ID];
const injected = new InjectedConnector({ supportedChainIds });

export const connectorsByType: {
  [connectorName in ConnectorType]: AbstractConnector;
} = {
  [ConnectorType.Injected]: injected,
};
