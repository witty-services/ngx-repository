import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../model/person.model';
import { PersonRepository } from '../repository/person.repository';
import { Chance } from 'chance';
import {Client} from '../model/client.model';

@Injectable()
export class PersonService {

  private chance: Chance.Chance = new Chance.Chance();

  public constructor(private personRepository: PersonRepository) {
  }

  public searchByFirstName(searchedFirstName: string): Observable<Person[]> {
    return this.personRepository.searchByFirstName(searchedFirstName);
  }

  public create(): Observable<string> {
    return this.personRepository.create(new Person({
      id: `${Date.now()}`,
      firstName: this.chance.first(),
      lastName: this.chance.last()
    }));
  }

  public update(person: Person): Observable<void> {
    const personToUpdate: Person = new Person(person);

    personToUpdate.firstName = this.chance.last();

    return this.personRepository.update(personToUpdate);
  }

  public patch(person: Person): Observable<void> {
    return this.personRepository.patch(new Person({
      id: person.id,
      firstName: this.chance.first()
    }));
  }
}
