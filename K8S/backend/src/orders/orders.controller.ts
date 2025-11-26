/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  orderRepository: any;
    constructor(private readonly ordersService: OrdersService) {}

  @Get()
    async getOrders(): Promise<Order[]> {
      return this.ordersService.findAll();  // Obtener todas las órdenes ordenadas por prioridad
      }
      @Get()
      async getOrdersWithUsers(): Promise<Order[]>{
        return this.ordersService.getOrdersWithUsers();
      }

  @Get(':id')
    async findOne(@Param('id') id: number) {
      const order = await this.ordersService.findOne(id)
      if(order){
        return order;  
      }  else {
         throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }}
     
  /*

   /* @Get(':priority')
    async findOrdersByPriority(@Param('priority') priority: string) {
      return this.ordersService.findOrdersByPriority(priority);
    } */
 
    @Post()
    async create(@Body() createOrdersDto: CreateOrdersDto): Promise<Order> {
      const result = await this.ordersService.create(createOrdersDto);
      if ('error' in result) {
        throw new BadRequestException(result.error);
      }
      return result;
    }

    @Put(':id')
      async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Order>   {
        return this.ordersService.update(id, updateOrderDto)
    }
 
  @Delete(':id') //"ESTE FUNCIONA"
    remove(@Param('id') id: number): Promise<void> {
      return this.ordersService.remove(id);
    }
}
