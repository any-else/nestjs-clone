import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from 'src/cart/service/cart/cart.service';
import { CreateCartDto } from 'src/dtos/CreateCart.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Get('')
  getCartMe(@Req() req: Request, @Res() res: Response) {
    // console.log(req.headers.authorization.split(' ')[1]);
    return this.cartService.getCartMe(req, res);
  }

  @UseGuards(AuthGuard)
  @Post('')
  createCart(
    @Body() createCartDto: CreateCartDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.cartService.createCartService(createCartDto, req, res);
  }

  @UseGuards(AuthGuard)
  @Patch('inCart')
  inCartController(
    @Body() createCartDto: { idCartProd: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.cartService.inCartService(createCartDto.idCartProd, req, res);
  }

  @UseGuards(AuthGuard)
  @Patch('decCart')
  decCartController(
    @Body() createCartDto: { idCartProd: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.cartService.decCartService(createCartDto.idCartProd, req, res);
  }

  @UseGuards(AuthGuard)
  @Patch('deleteEachItem')
  deleteEachItemController(
    @Body() createCartDto: { idCartProd: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.cartService.deleteEachItemService(
      createCartDto.idCartProd,
      req,
      res,
    );
  }
}
