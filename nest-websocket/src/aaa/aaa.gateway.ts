import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { Observable } from 'rxjs';

@WebSocketGateway()
export class AaaGateway {
  constructor(private readonly aaaService: AaaService) {}

  @SubscribeMessage('createAaa')
  create(@MessageBody() createAaaDto: CreateAaaDto) {
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
