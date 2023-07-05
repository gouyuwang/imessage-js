import Socket from 'socket.io-client'

export interface StandardErrorPayload {
  type: string,
  data: {
    channel ?: string
    response ?: object
  }
}

export interface ClientOptions {
  upgrade ?: boolean,
  forceJSONP ?: boolean,
  jsonp ?: boolean,
  forceBase64 ?: boolean,
  enablesXDR ?: boolean,
  timestampRequests ?: boolean,
  rememberUpgrade ?: boolean,
  onlyBinaryUpgrades ?: boolean,
  timestampParam ?: string,
  policyPort ?: number,
  requestTimeout ?: number,
  protocols ?: Array<String>,
  transports ?: Array<String>,
  transportOptions ?: object
}


export interface Client {
  socket: Socket,
  subscribe: (channels: string | string[]) => Manager,
  unsubscribe: (channels: string | string[]) => Manager,
  connected: (cb?: (client: Client, socket: Socket) => void) => Promise<Client> | void,
  onError: (cb?: (payload: StandardErrorPayload) => void) => Promise<object> | void,
  broadcast: (channel: string | string[], ev : string | any, payload ?: any) => void,
  on: (ev: string, cb : Function) => void,
  emit: (ev: string,  payload : any) => void,
  select: (channel: string | string[], create ?: boolean) => Channel | Manager,
  main: () => Channel,
  open: () => Client,
  close: () => Client,
  recreate: (url ?: string | ClientOptions, options ?: ClientOptions) => Client,
  getSocket: (autoCreate : boolean) => Socket,
  setUrl: (url : string) => Client,
  setOptions: (options : ClientOptions) => Client,
  create: () => Client,
}

declare interface Channel {
  name: string,
  client: Client,
  broadcast:  (ev : string | any, payload ?: any) => Channel,
  on: (ev: string, cb : Function, once ?: boolean) => Channel,
}

declare interface Manager {
  channels: Channel[],
  broadcast:  (ev : string | any, payload ?: any) => Manager,
  on: (ev: string, cb : Function, once ?: boolean) => Manager,
  push: (channel : Channel) => Manager,
  select: (channel: string | string[]) => Manager,
  out: (channel: string | string[]) => Manager,
  has: (channel: string ) => boolean,
}

declare interface Constructor {
  new(url: string, options: ClientOptions, autoCreate: boolean): Client
}

export const Client: Constructor;
