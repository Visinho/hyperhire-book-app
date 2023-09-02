import { RoutingKeys } from 'src/enums/routingkeys.enum';

export interface IMessageBroker {
  produce(payload: any, routing_key: RoutingKeys): Promise<boolean>;

  consume(): void;
}
