/* eslint-disable no-empty */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class TypeOrmAdapter {
  connection: any;

  constructor(connection: any) {
    this.connection = connection;
  }

  async build(entity: any, props: any) {
    const { manager } = this.connection;
    const modelRepo = manager.getRepository(entity);
    const model = modelRepo.create(props);
    return model;
  }

  async save(model: any) {
    return this.connection.manager.save(model);
  }

  async destroy(model: any, entity: any) {
    const { manager } = this.connection;
    try {
      if (this.connection.options.type === 'sqlite') {
        await manager.query('PRAGMA foreign_keys = OFF;');
      } else {
        await manager.query('SET FOREIGN_KEY_CHECKS=0;');
      }
      await manager.delete(entity, model.id ? model.id : model.api_id);
      if (this.connection.options.type === 'sqlite') {
        return manager.query('PRAGMA foreign_keys = ON;');
      }
      return manager.query('SET FOREIGN_KEY_CHECKS=1;');
    } catch (err) {
      return '';
    }
  }

  get(entity: any, attr: any) {
    return entity[attr];
  }

  set(props: any, entity: any) {
    Object.keys(props).forEach(key => {
      entity[key] = props[key];
    });
    return entity;
  }
}
