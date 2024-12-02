export interface Root {
  requestId: string;
  inputMessage: string;
  creationTimestamp: string;
  statusCode: string;
  statusReason: string;
  flowType: string;
  translationDirection: string;
  inputMessageType: any;
  senderBic: string;
  receiverBic: string;
  outputMessage: string;
  outputMessageType: string;
  senderDn: string;
  receiverDn: string;
  events: Event[];
}

export interface Event {
  id: number;
  requestId: string;
  statusCode: string;
  statusReason: string;
  timestamp: string;
  flowType: string;
  translationDirection: string;
}
