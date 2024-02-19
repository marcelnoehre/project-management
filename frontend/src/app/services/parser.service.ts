import { Injectable } from '@angular/core';
import { State } from '../interfaces/data/state';
import * as JsonToXML from "js2xmlparser";
import * as XML from 'xml-js';
import * as YAML from 'yaml';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  public readStates(list: State[]) {
    return list.map((item) => ({
      state: item.state,
      tasks: item.tasks.map(({ uid, project, state, ...task }) => task)
    }));
  }

  public statesToJSON(taskList: State[]): Blob {
    return new Blob([JSON.stringify(this.readStates(taskList), null, 2)], { type: 'application/json' });
  }

  public statesToXML(taskList: State[]): Blob {
    return new Blob([JsonToXML.parse('root', this.readStates(taskList))], { type: 'application/xml' });
  }

  public statesToYAML(taskList: State[]): Blob {
    return new Blob([YAML.stringify(this.readStates(taskList))], { type: 'text/yaml' });
  }

  public encodeFileInput(fileInput: string, fileExtension: string) {
    let taskList;
    const rawInput = atob(fileInput.split(',')[1]);
    switch (fileExtension) {
      case 'json':
        taskList = JSON.parse(rawInput);
        break;
      case 'xml':
        taskList = JSON.parse(XML.xml2json(rawInput, {compact: true, spaces: 2})).root.row.map((row: any) => ({
          state: row.state._text,
          tasks: row.tasks.map((task: any) => ({
            uid: task.uid._text,
            author: task.author._text,
            project: task.project._text,
            state: task.state._text,
            title: task.title._text,
            description: task.description._text
          }))
        }));
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
