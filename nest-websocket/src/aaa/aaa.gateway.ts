import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AaaGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly aaaService: AaaService) {}

  afterInit(server: Server) {}

  handleConnection(client: Server, ...args: any[]) {}

  handleDisconnect(client: Server) {}

  @SubscribeMessage('createAaa')
  create(
    @MessageBody() createAaaDto: CreateAaaDto,
    @ConnectedSocket() server: Server,
  ) {
    server.emit('guang', 777);

    this.server.emit('guang', 777);

    return this.aaaService.create(createAaaDto);
  }

  @SubscribeMessage('findAllAaa')
  findAll() {
    /** 返回事件 */
    return {
      event: 'guang',
      data: this.aaaService.findAll(),
    };
  }

  @SubscribeMessage('findOneAaa')
  findOne(@MessageBody() id: number) {
    return new Observable((observer) => {
      observer.next({
        event: 'findOneAaa',
        data: {
          msg: this.aaaService.findOne(id),
        },
      });

      setTimeout(() => {
        observer.next({
          event: 'findOneAaa',
          data: {
            msg: this.aaaService.findOne(id),
          },
        });
      }, 2000);

      setTimeout(() => {
        observer.next({
          event: 'findOneAaa',
          data: {
            msg: this.aaaService.findOne(id),
          },
        });
      }, 5000);
    });
  }

  @SubscribeMessage('updateAaa')
  update(@MessageBody() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(updateAaaDto.id, updateAaaDto);
  }

  @SubscribeMessage('removeAaa')
  remove(@MessageBody() id: number) {
    return this.aaaService.remove(id);
  }
}
