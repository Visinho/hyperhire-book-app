import { RoutingKeys } from 'src/enums/routingkeys.enum';

export const EXCHANGE_NAME = 'book-exchange';
export const EXCHANGE_TYPE = 'topic';
export const QUEUE_NAME = RoutingKeys.CUSTOMER_BOOK_SERVICE;
