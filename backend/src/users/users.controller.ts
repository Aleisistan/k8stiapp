/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto/create-users.dto';
import { UpdateUserDto } from './dto/create-users.dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Get()
    async getUser(): Promise<User[]> {
      return  this.usersService.findAll(); // Obtener todos los usuarios ordenadas por instituto
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number) {
      const { orderCount, user } = await this.usersService.findUserWithOrderCount(id);
        if(user){
          return { orderCount, user };  
        }  else {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }}

  @Post()
  async create(@Body() createUsersDto: CreateUsersDto): Promise<User> {
    const user = await this.usersService.create(createUsersDto);
    return user;
  }

  @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto):Promise<User>   {
      this.usersService.update(id, updateUserDto);
        return;
 
}


@Delete(':id') 
//COMENTADO 16:10 14:30
remove(@Param('id') id: number)  {
  return this.usersService.remove(id);

  }
}


    //COMENTADO 15/10 16:20
 /* @Get()
  findAll(@Query() query: QueryUsersDto) {
    // eslint-disable-next-line prefer-const
 let institute = query.institute;
 let id = query.id;
 let sortBy = query.sortBy;
 let orderBy = query.orderBy;
 return this.usersService.findAll({});
}*/
 /*async getUsersWithOrders(): Promise<User[]> {
          return this.usersService.getUsersWithOrders();
         }
   //COMENTADO 15/10
 // Obtener el número de órdenes para un usuario específico
 /*@Get(':id/orders-count')
 async getUserOrderCount(@Param('id') id: number) {
   const result = await this.usersService.findUserWithOrderCount(id);
   return {
     user: result.user,
     orderCount: result.orderCount,
   };
 }*/ 

 // Obtener todos los usuarios con la cantidad de órdenes
 /*@Get() //COMENTADO 15/10 16:25
 async getUsersWithOrders(): Promise<User[]> {
  return this.usersService.getUsersWithOrders();
 }*/
 //COMENTADO 15/10 16:00
 /*async getAllUsersWithOrderCount() {
   return this.usersService.findAllUsersWithOrderCount();
 }*/