# How to create an entity

Make sure that you have created a migration for your entity first. Creating an
entity with typeorm is relativly straight forward. First you create a class that
represents your entity and then decorate it with `@Entity` or `@OwnableEntity`.
The later updates `createdBy` and `updatedBy` with the currently logged in user.
If you create any properties you can decorate them with `@Column` and add
validation via [class-validator](https://github.com/typestack/class-validator).

To create an entity from our [previous migration example](./migrations.md) this
would look like this:

```typescript
/*!
 * @copyright FLYACTS GmbH 2018
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Length } from 'class-validator';
import { Column } from 'typeorm';

/**
 * Representation of an exapmle entity
 */
@OwnableEntity('example')
export class Example extends BaseEntity {
    @Column({
        name: 'display_name',
    })
    @Length(1, 100)
    public displaName!: string;
}
```
