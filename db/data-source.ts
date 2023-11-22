import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  // host: 'bci80gmi1bjlkj64eohc-mysql.services.clever-cloud.com',
  host: 'localhost',
  port: 3306,
  // username: 'uuwbalsehts6nto3',
  username: 'root',
  // password: 'JEKv9q9iGwJSAILNwiU6',
  password: 'vuvanbui@18',
  database: 'nest-ecom',
  // database: 'amazon_database',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
