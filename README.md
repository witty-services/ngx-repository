# NGX-REPOSITORY

![ngx-repository-ci](https://github.com/witty-services/ngx-repository/workflows/build/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/witty-services/ngx-repository/badge.svg?branch=master)](https://coveralls.io/github/witty-services/ngx-repository?branch=master)
[![npm version](https://badge.fury.io/js/%40witty-services%2Fngx-repository.svg)](https://badge.fury.io/js/%40witty-services%2Fngx-repository)
![GitHub](https://img.shields.io/github/license/witty-services/ngx-repository)
![GitHub repo size](https://img.shields.io/github/repo-size/witty-services/ngx-repository)
![GitHub last commit](https://img.shields.io/github/last-commit/witty-services/ngx-repository)
![GitHub issues](https://img.shields.io/github/issues/witty-services/ngx-repository)
![GitHub top language](https://img.shields.io/github/languages/top/witty-services/ngx-repository)

NgxRepository allows you to easily create a strongly typed data access layer in your Angular project.

## Summary

* [How to install](#how-to-install)
  * [Main module](#main-module)
  * [Http Driver](#http-driver)
  * [Firebase Driver](#firebase-driver)
  * [Import Modules](#import-modules)
* [Basic usage](#basic-usage)
  * [Resource](#resource)
    * [HttpResource and FirebaseResource](#httpresource-and-firebaseresource)
    * [Id and Column](#id-and-column)
  * [Repository](#repository)
* [Id and Column configuration](#id-and-column-configuration)
* [Path parameters and PathColumn](#path-parameters-and-pathcolumn)
* [Fetch associated resource](#fetch-associated-resources)  
  * [JoinColumn](#joincolumn)
  * [SubCollection](#subcollection)
* [Query](#query)
* [Resource configuration](#resource-configuration)
* [HTTP Pagination](#http-pagination)
  * [Page type](#page-type)
  * [Page response processor](#page-response-processor)
* [HttpLiveResource](#httpliveresource)
* [Advanced usage](#advanced-usage)
  * [Custom repository](#custom-repository)
  * [Event system](#event-system)
* [Test and debug](#test-and-debug)
  * [NgxRepositoryTestingModule](#ngxrepositorytestingmodule)
  * [Enable debug mode](#enable-debug-mode)
* [Install and build project](#install-and-build-project)

## How to install

### Main module

First install the main library in your project :

```shell script
npm install --save @witty-services/ngx-repository
```

After that, choose drivers and install them as follows.

### Http Driver

```shell script
npm install --save @witty-services/ngx-http-repository
```

### Firebase Driver

```shell script
npm install --save @witty-services/ngx-firebase-repository
```

### Import modules

To start using NgxRepository, import `NgxRepositoryModule` and the modules corresponding to the chosen drivers :

```typescript
import { NgxRepositoryModule } from '@witty-services/ngx-repository';
import { NgxHttpRepositoryModule } from '@witty-services/ngx-http-repository';
import { NgxFirebaseRepositoryModule } from '@witty-services/ngx-firebase-repository';

@NgModule({
  imports: [
    NgxRepositoryModule.forRoot(),
    NgxHttpRepositoryModule, // Http driver
    NgxFirebaseRepositoryModule.forRoot(
      firebase.initializeApp({
        apiKey: 'TODO',
        authDomain: 'TODO',
        databaseURL: 'TODO',
        projectId: 'TODO',
        storageBucket: 'TODO',
        messagingSenderId: 'TODO',
        appId: 'TODO',
        measurementId: 'TODO'
      }).firestore()
    ), // Firebase driver
  ]
})
export class AppModule {
}
```

## Basic usage

This library abstracts the data access layer of your Angular project. You just need to provide some configuration thanks
to typescript decorators to start using auto-generated repositories.

### Resource

Start by creating a Typescript class for the type of resource you need to manipulate with NgxRepository. Once this is
done, you can start annotating this class with the following decorators.

#### HttpResource and FirebaseResource

First, add a `@HttpResource()` or `@FirebaseResource()` decorator (depending on which protocol you wish to use)
on the resource class. The most basic configuration for this annotation consists in giving the HTTP or Firebase resource
path of the resource.

```typescript
import { FirebaseResource } from '@witty-services/ngx-firebase-repository';
import { HttpResource } from '@witty-services/ngx-http-repository';

// for Http
@HttpResource({
  path: '/api/users'
})
// or for Firebase
@FirebaseResource({
  path: '/users'
})
export class User {
  // ...
}
```

#### Id and Column

Then, add an `@Id()` decorator on the resource id and `@Column()` decorators on each resource field you want
mapped with NgxRepository.

```typescript
import { FirebaseResource } from '@witty-services/ngx-firebase-repository';
import { HttpResource } from '@witty-services/ngx-http-repository';
import { Id, Column } from '@witty-services/ngx-repository';

// for Http
@HttpResource({
  path: '/api/users'
})
// or for Firebase
@FirebaseResource({
  path: '/users'
})
export class User {

  @Id() // define the resource id
  public id: number;

  @Column() // define a column
  public firstName: string;

  @Column()
  public lastName: string;
}
```

### Repository

Right, now you have your resources. NgxRepository will generate all repositories on demand. You just have to inject it
in your services using the
`@InjectRepository()` decorator. You need to specify in the decorator context the type of your resource and the type
of your repository(`HttpRepository`, `FirebaseRepository`...).

The generic types of the generated repository type are the type of the resource and the type of the resource id.

```typescript
import { InjectRepository, Page } from '@witty-services/ngx-repository';
import { HttpRepository } from '@witty-services/ngx-http-repository'

@Injectable()
export class BookService {

  // repository is build with Http driver for User resource
  @InjectRepository({resourceType: () => Book, repository: () => HttpRepository})
  private readonly bookRepository: HttpRepository<Book, number>;

  public findAll(): Observable<Page<Book>> {
    return this.bookRepository.findAll();
  }

  // returns the id of created resource
  public create(book: Book): Observable<number> {
    return this.bookRepository.create(book);
  }

  // observable completes when update is effective
  public update(book: Book): Observable<void> {
    return this.bookRepository.update(book);
  }
}
```

Each repository of a resource made from `FirebaseDriver` or `HttpDriver` are singleton services stored in
Angular Injector, so don't worry about injecting them on several services.

Last but not least : NgxRepository automatically serializes and deserializes your resources
between JSON and strongly typed TypeScript classes. Note that only fields with
`@Id()` or `@Column()` decorators are marked for serialization.

## Id and Column configuration

You can add configuration to `@Id()` and `@Column()` decorators as follows.

```typescript
import { HttpResource } from '@witty-services/ngx-http-repository';
import { Id, Column, DateConverter } from '@witty-services/ngx-repository';

@HttpResource({
  path: '/api/users'
})
export class User {

  @Id() // define the resource id
  public id: number;

  @Column() // define a column
  public firstName: string;

  @Column('lastname')  // define a column with special mapping
  public lastName: string;

  @Column(() => Address) // define a column with a child model
  public address: Address;

  @Column({type: () => Job, field: 'job'}) // combine model and special mapping
  public myJob: Job;

  @Column({field: 'createdAt', customConverter: () => DateConverter}) // use custom converter for special type
  public createdAt: Date;
}
```

As shown in the example above, each configuration field is optional : you can define 
any field you want or not to have any configuration at all.

| Field                  | Description                                                                                                     | Available on `@Id()`   |
|------------------------|-----------------------------------------------------------------------------------------------------------------|------------------------|
| `field`                | Field name in JSON                                                                                              | Yes                    |
| `type`                 | Field type after deserialization : only fields with `@Id()` or `@Column()` decorator in type will be serialized | No                     |
| `readOnly`             | Boolean to indicate to not send the value in json to the server                                                 | Yes                    |
| `writeOnly`            | Boolean to indicate to ignore the field in json                                                                 | Yes                    |
| `customConverter`      | A converter to make a custom serialization/deserialization                                                      | No                     |
| `denormalizeNull`      | Boolean to override global configuration to denormalize the column when is set to null value                    | Yes                    |
| `denormalizeUndefined` | Boolean to override global configuration to denormalize the column when is set to undefined value               | Yes                    |
| `normalizeNull`        | Boolean to override global configuration to normalize the column when is set to null value                      | Yes                    |
| `normalizeUndefined`   | Boolean to override global configuration to normalize the column when is set to undefined value                 | Yes                    |

The `field` and `type` fields can be defined using a shorthand. For `field`,
just specify a string directly in the context, it will be interpreted as such. Same thing
for `type` : specify directly an anonymous function returning the type in the context
(as shown in the example).

## Path parameters and PathColumn

You can add parameters on a resource path using `:` character. You can map those parameters
with values using the [query system](#query).

`@PathColumn()` decorator allows you to retrieve the path parameter value of a 
resource and map it to the decorated field.

```typescript
import { HttpResource } from '@witty-services/ngx-http-repository';
import { Id, Column, PathColumn } from '@witty-services/ngx-repository';

@HttpResource({
  path: '/libraries/:libraryId/books'
})
export class Book {

  @Id()
  public id: number;

  @Column()
  public title: string;

  @PathColumn()
  public libraryId: string;

  // or

  @PathColumn('libraryId')
  public theLibraryId: string;

}
```

## Fetch associated resources

### JoinColumn

You can fetch associated resources using `JoinColumn`.

```typescript
import { HttpResource } from '@witty-services/ngx-http-repository';
import { Id, Column, JoinColumn } from '@witty-services/ngx-repository';
import { FirebaseRepository } from '@witty-services/ngx-firebase-repository';

@HttpResource({
  path: '/libraries/:libraryId/books'
})
export class Book {

  @Id()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public authorId: string;

  // initialize the request to get associated author, using instance attribute 'authorId' with User FirebaseRepository
  @JoinColumn({attribute: 'authorId', resourceType: () => User, repository: () => FirebaseRepository})
  public author$: Observable<Person>; // data will be lazy fetched on subscribe
}
```

### SubCollection

You can fetch associated resources using `SubCollection`.

```typescript
import { HttpResource, HttpRepository } from '@witty-services/ngx-http-repository';
import { Id, Column, SubCollection } from '@witty-services/ngx-repository';

@HttpResource({
  path: '/libraries/:libraryId/books'
})
export class Book {

  @Id()
  public id: number;

  @Column()
  public title: string;

  // you should specify the corresponding resource, how to request resources and the repository to use
  @SubCollection({
    resourceType: () => Comment,
    // params are extra information context request (for example libraryId in path) 
    params: (book: Book, params: any) => new CommentQuery({bookId: book.id, libraryId: params.libraryId}),
    repository: () => HttpRepository
  })
  public comments$: Observable<Comment[]>;
}
```

## Query

With NgxRepository, a Query is an object holding some informations associated with the
querying of one or several resources. You can then provide an instance of this Query as a
parameter of any method available on `HttpRepository` or `FirebaseRepository`.

Here is an example of a query for a `@HttpResource()` :

```typescript
import { HttpQueryParam, HttpHeader } from '@witty-services/ngx-http-repository';
import { PathParam } from '@witty-services/ngx-repository';

export class BookQuery {

  // use http query param

  @HttpQueryParam() // param is forwarded into http query param
  public title: string;

  // or

  @HttpQueryParam('title')
  public theTitle: string;

  // use path param

  @PathParam() // param replace :libraryId into resource path
  public libraryId: string;

  // or

  @PathParam('libraryId')
  public library: string;

  // use http header

  @HttpHeader() // path is forwarded into http header
  public page: number = 1;

  // or

  @HttpHeader('itemPerPage')
  public size: number = 2;

  public constructor(data: Partial<BookQuery> = {}) {
    Object.assign(this, data);
  }
}
```

And an example of a query for a `@FirebaseResource()` :

```typescript
import {
  FirebaseCriteria,
  FirebaseEndAt,
  FirebaseEndBefore,
  FirebaseLimit,
  FirebaseLimitToLast,
  FirebaseOrderBy,
  FirebaseOrderByContext,
  FirebaseStartAfter,
  FirebaseStartAt
} from '@witty-services/ngx-firebase-repository';

export class ClientQuery {

  @FirebaseCriteria({field: 'lastName', operator: '=='})
  public lastNameEqual?: string;

  @FirebaseOrderBy()
  public orderBy?: string|FirebaseOrderByContext|(FirebaseOrderByContext|string)[];

  @FirebaseStartAt()
  public startAt?: any;

  @FirebaseStartAfter()
  public startAfter?: any;

  @FirebaseEndAt()
  public endAt?: any;

  @FirebaseEndBefore()
  public endBefore?: any;

  @FirebaseLimit()
  public limit?: number;

  @FirebaseLimitToLast()
  public limitToLast?: number;

  public constructor(data: Partial<ClientQuery> = {}) {
    Object.assign(this, data);
  }
}
```

The following table lists all the type of fields you can add to a query object and with
which repository they are available.

| Decorator                | Description                                                       | Repository type                        |
|--------------------------|-------------------------------------------------------------------|----------------------------------------|
| `@PathParam()`           | Replaces path parameter with field value                          | `HttpRepository`, `FirebaseRepository` |
| `@HttpQueryParam()`      | Adds a query param to the HTTP request (eg. `/users/?name=Oscar`) | `HttpRepository`                       |
| `@HttpHeader()`          | Adds a HTTP header to the request with field value                | `HttpRepository`                       |
| `@FirebaseCriteria()`    | Adds a Firestore query criteria                                   | `FirebaseRepository`                   |
| `@FirebaseOrderBy()`     | Adds a `.orderBy()` clause to Firestore request                   | `FirebaseRepository`                   |
| `@FirebaseLimit()`       | Adds a `.limit()` clause to Firestore request                     | `FirebaseRepository`                   |
| `@FirebaseLimitToLast()` | Adds a `.limitToLast()` clause to Firestore request               | `FirebaseRepository`                   |
| `@FirebaseStartAt()`     | Adds a `.startAt()` query cursor to Firestore request             | `FirebaseRepository`                   |
| `@FirebaseStartAfter()`  | Adds a `.startAfter()` query cursor to Firestore request          | `FirebaseRepository`                   |
| `@FirebaseEndAt()`       | Adds a `.endAt()` query cursor to Firestore request               | `FirebaseRepository`                   |
| `@FirebaseEndBefore()`   | Adds a `.endBefore()` query cursor to Firestore request           | `FirebaseRepository`                   |

The following example shows a query used in a `findAll()` operation on a Firebase
resource.

```typescript
@Injectable()
export class ClientService {

  @InjectRepository({resourceType: () => Client, repository: () => FirebaseRepository})
  private repository: FirebaseRepository<Client, string>;

  public searchByLastName(searchedLastName: string): Observable<Page<Client>> {
    return this.repository.findAll(new ClientQuery({
      lastNameEqual: searchedLastName,
      orderBy: ['firstName']
    }));
  }
}
```

## Resource configuration

You can configure your resource to your needs by adding context to `@HttpResource()` 
and `@FirebaseResource()` resource decorators.

> For example, you may need to specify a different path to your resource depending on
> the operation. This can be done by using the syntax in the following example.

```typescript
@HttpResource({
  path: '/libraries',
  update: '/library',
})
export class Library {
  
}
```

For each operation execution, NgxRepository will look for a specific context attached to
the operation for the resource. If no specific context is found, the default context 
(here the `path`) will be used.

The available configuration is different depending on the type of resource and the 
targeted operation.

The targetable operations are the following :

* `findById`
* `findOne`
* `findAll`
* `create`
* `update`
* `patch`
* `delete`
* `read`
* `write`

**Response type**

Define a specific response type (different from the resource) using `responseType`
context parameter.

```typescript
@HttpResource({
  path: '/libraries',
  write: {
    responseType: () => WriteLibraryDto
  }
})
export class Library {

}
```

**Path**

Define a specific path for an operation using `path` context parameter. Passing a
string directly as an operation context is also possible to define the `path` context
parameter.

> ⚠️ This context parameter is only available for `@HttpResource()`

```typescript
@HttpResource({
  path: '/libraries',
  create: {
    path: '/create-a-library'
  },
  update: '/update-a-library'
})
export class Library {

}
```

**Page response processor**

Define a specific [page response processor](#page-response-processor) using
`pageResponseProcessor` context parameter.

> ⚠️ This context parameter is only available for `findAll` operation and
> `@HttpResource()`

```typescript
@HttpResource({
  path: '/libraries',
  findAll: {
    pageResponseProcessor: MyPageResponseProcessor
  }
})
export class Library {

}
```

**Global configuration**

It is also possible to add some global configuration by adding it directly in the
`forRoot()` method of your driver module import.

## HTTP Pagination

> ⚠️ This feature is only available for `@HttpResource()`

### Page type

NgxRepository comes with a prebuilt HTTP pagination system. If a `@HttpResource()` is
paginated server-side, the server usually sends in the HTTP response some context about the
data being sent (page number, total number of elements and page size). NgxRepository holds
these infos in a `Page` object.

The `Page` class extends the `Array` type and exposes additional infos about
eventual server-side pagination.

This is the implementation of the `Page` type :

```typescript
export class Page<T = any> extends Array<T> {

  public currentPage: number;

  public itemsPerPage: number;

  public totalItems: number;
}
```

The `findAll` method of `HttpRepository` returns a `Observable<Page<T>>` 
where `T` is your resource. You can use it as an `Array` or as a `Page`
if you want to access the pagination infos.

### Page response processor

By default, the fields of the `Page` object returned by the
`findAll`method of `HttpRepository` will be equal to :

* `0` for the `currentPage` field
* `items.length` for the `itemsPerPage` and `totalItems` fields

This is because the pagination infos can be returned in different ways (sometimes in
the response headers, sometimes in the body... ). To indicate how the server returns
these elements, you have to create a `PageResponseProcessor`.

```typescript
import { Injectable } from '@angular/core';
import { Page, RequestManagerContext, ResponseProcessor } from '@witty-services/ngx-repository';
import { HttpRepositoryResponse } from '@witty-services/ngx-http-repository';

@Injectable()
export class MyPageResponseProcessor implements ResponseProcessor {

  public transform(response: any, origin: HttpRepositoryResponse, context: RequestManagerContext): any {
    const totalItems: number = parseInt(origin.getHeaders().get('apiTotalItems'), 10);
    const itemsPerPage: number = parseInt(origin.getHeaders().get('apiPerPage'), 10);
    const currentPage: number = parseInt(origin.getHeaders().get('apiCurrentPage'), 10);

    return Page.build(response, currentPage, itemsPerPage, totalItems);
  }
}
```

A `PageResponseProcessor` implements the `ResponseProcessor` interface. This
interface exposes a `transform()` method which transforms the HTTP response.
In this method, you can build a `Page` object using the infos about the HTTP
response provided in the `transform()` method parameters.

Then, provide this processor in your `AppModule` and add it to
any `findAll` configuration you need. It can be on a 
[specific `HttpResource()` or globally](#resource-configuration).

## HttpLiveResource

> ⚠️ This feature is only available for `@HttpResource()`

## Advanced usage

### Custom Repository

In specific case, you can define a custom repository like that :

```typescript
import { Repository } from '@witty-services/ng-repository';
import { HttpRepository } from '@witty-services/ng-http-repository';

@Injectable()
@Repository(() => Person)
export class PersonRepository extends HttpRepository<Person, string> {

  public searchByFirstName(searchedFirstName: string): Observable<Person[]> {
    // write your custom logic here
  }
}

@Injectable()
export class PersonService {

  // Like a standard service, you can inject your custom repository
  public constructor(private readonly personRepository: PersonRepository) {
  }
}
```

### Event system

## Test and debug

### NgxRepositoryTestingModule

### Enable debug mode

## Install and build project

To install and build the project, you just have to clone the repository and make the dependency installation :

````shell script
npm i
````

After dependency installation, you can run others commands :

````shell script
# Run the tests
npm run test

# Run the linter
npm run lint

# Run the example app
npm run start
````
