import { Injectable } from '@angular/core';
import { State } from '../interfaces/data/state';
import { Export } from '../interfaces/export';
import * as JsonToXML from "js2xmlparser";
import * as XML from 'xml-js';
import * as YAML from 'yaml';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  public exportFormat(list: State[]): Export[] {
    const exportList: Export[] = [];
    list.forEach((state) => {
      state.tasks.forEach((task) => {
        exportList.push({
          title: task.title, 
          description: task.description, 
          author: task.author,
          assigned: task.assigned,
          state: task.state 
        })
      });
    });
    return exportList;
  }

  public tasksToJSON(taskList: Export[]): Blob {
    return new Blob([JSON.stringify(taskList, null, 2)], { type: 'application/json' });
  }

  public tasksToXML(taskList: State[]): Blob {
    return new Blob([JsonToXML.parse('root', taskList)], { type: 'application/xml' });
  }

  public tasksToYAML(taskList: State[]): Blob {
    return new Blob([YAML.stringify(taskList)], { type: 'text/yaml' });
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

  public async sha256(message: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}
}
