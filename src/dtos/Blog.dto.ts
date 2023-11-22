import { IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateBlog {
  title: string;
  description: string;
}
