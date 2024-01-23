import { Injectable } from '@angular/core';
import { State } from '../interfaces/data/state';
import * as JsonToXML from "js2xmlparser";
import * as YAML from 'yaml';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor() { }

  readStates(list: State[]) {
    return list.map((item) => ({
      state: item.state,
      tasks: item.tasks.map(({ uid, project, state, ...task }) => task)
    }));
  }

  statesToJSON(taskList: State[]): Blob {
    return new Blob([JSON.stringify(this.readStates(taskList), null, 2)], { type: 'application/json' });
  }

  statesToXML(taskList: State[]): Blob {
    return new Blob([JsonToXML.parse('root', this.readStates(taskList))], { type: 'application/xml' });
  }

  statesToYAML(taskList: State[]): Blob {
    return new Blob([YAML.stringify(this.readStates(taskList))], { type: 'text/yaml' });
  }

  encodeFileInput(fileInput: string, fileExtension: string) {
    let taskList;
    const rawInput = atob(fileInput.split(',')[1]);
    switch (fileExtension) {
      case 'json':
        taskList = JSON.parse(rawInput);
        break;
      case 'xml':
        const parser = new DOMParser();
        taskList = parser.parseFromString(rawInput, 'application/xml');
        break;
      case 'yml':
      case 'yaml':
        taskList = YAML.parse(rawInput);
        break;
      default:
        taskList = null;
        break;
    }
    return taskList;
  }

}
