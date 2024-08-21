import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'https://glazovest.ru', 'https://api.glazovest.ru']
  },
  namespace: 'orders'
})
export class OrdersSocketService implements OnGatewayConnection {
  handleConnection(client: any) {
  }

  @SubscribeMessage('join-room')
  joinRoom(
    @ConnectedSocket() client: any,
    @MessageBody('room') room: any
  ) {
    // console.log('joined room:', room);
    client.join(room)
  }

  @SubscribeMessage("create-order-to-server")
  handleEvent(
    @MessageBody('order') order: any,
    @ConnectedSocket() client: any
  ) {
    // send event TO the room with name order.rest
    client.to(order.rest).emit("create-order-to-client", order)
  }
}