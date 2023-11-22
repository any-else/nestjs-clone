import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BookingService } from 'src/booking/service/booking/booking.service';
import { Roles } from 'src/decorator/roles.decorator';
import { CreateStatus } from 'src/dtos/CreateStatus.dto';
import { CreateChargeDto } from 'src/dtos/CreateStripe.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { OptionalParseIntPipe } from 'src/pipe/int.transform';
import { Role } from 'src/types/role.enum';

@Controller('booking')
export class BookingController {
  constructor(private stripeService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  createCharge(
    @Body() charge: CreateChargeDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    console.log(charge.orders);
    return this.stripeService.charge(
      charge.orders,
      charge.infor,
      request,
      response,
    );
  }
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('get-all-orders')
  getAllOrders(
    @Res() res: Response,
    @Query('idStatus', OptionalParseIntPipe) idStatus: number,
  ) {
    return this.stripeService.findOrdersAllUsers(idStatus, res);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('get-booking-user/:idUser')
  getBookingUser(
    @Param('idUser') idUser: number,
    @Res() res: Response,
    @Query('idStatus', OptionalParseIntPipe) idStatus: number,
  ) {
    return this.stripeService.getBookingByUser(idUser, idStatus, res);
  }

  @Post('stripe')
  stripeController(@Body() body: { id: string }, @Res() res: Response) {
    return this.stripeService.check(body.id, res);
  }

  @UseGuards(AuthGuard)
  @Post('cod')
  paypalController(
    @Body() charge: CreateChargeDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.stripeService.createBookingCod(
      charge.orders,
      charge.infor,
      request,
      response,
    );
  }

  @Post('status')
  statusController(@Body() body: CreateStatus, @Res() res: Response) {
    return this.stripeService.createStatus(body.name, res);
  }

  @Get('status')
  getStatusController(@Res() res: Response) {
    return this.stripeService.getStatus(res);
  }

  @UseGuards(AuthGuard)
  @Get('orders')
  getOrders(
    @Req() req: Request,
    @Res() res: Response,
    @Query('idStatus', OptionalParseIntPipe) idStatus: number,
  ) {
    return this.stripeService.findOrders(idStatus, req, res);
  }

  @Get(':idBooking')
  findBookingById(
    @Param('idBooking') idBooking: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.stripeService.findBookingById(idBooking, request, response);
  }

  @Patch(':idBooking')
  changeStatus(
    @Param('idBooking') idBooking: number,
    @Body() body: { idStatus: number },
    @Res() response: Response,
  ) {
    return this.stripeService.updateStatusService(
      idBooking,
      body.idStatus,
      response,
    );
  }
}
