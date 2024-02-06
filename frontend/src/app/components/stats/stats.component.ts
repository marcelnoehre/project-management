import { Component, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { StatsService } from 'src/app/services/stats.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { TaskStateColor } from 'src/app/enums/task-state-color.enum';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  information = 'INIT';
  mode: ProgressBarMode = 'determinate';
  loading = 0;
  data: any = {
    optimizeOrder: null,
    personalStats: null,
    stats: null,
    statLeaders: null,
    taskAmount: null,
    averageTime: null,
    wip: null,
    taskProgress: null,
    projectRoadmap: null
  }
  statLabels = ['created', 'imported', 'updated', 'edited', 'trashed', 'restored', 'deleted', 'cleared'];
  icons: any = {
    created: 'add',
    imported: 'upload_file',
    updated: 'view_kanban',
    edited: 'edit',
    trashed: 'delete',
    restored: 'undo',
    deleted: 'delete_forever',
    cleared: 'clear'
  }
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  constructor(
    private stats: StatsService,
    private translate: TranslateService
  ) {

  }

  async ngOnInit(): Promise<void> {
    await new Promise<void>(done => setTimeout(() => done(), 500));
    this.stats.init();
    this.stats.getUpdateSubject().subscribe(async (res) => {
      if (res.step === 'storage') {
        this.data = res.data;
        this.information = res.information;
        this.mode = 'indeterminate';
        await new Promise<void>(done => setTimeout(() => done(), 2000));
        this.loading = res.percentage * 100;
      } else {
        await new Promise<void>(done => setTimeout(() => done(), 500));
        this.loading = res.percentage * 100;
        this.information = res.information;
        this.data[res.step] = res.data;
      }
    });
  }

  loaded(): boolean {
    return this.loading === 100;
  }

  taskAmountData() {
    return {
      data: [
        {
          data: [
            this.data.taskAmount.NONE,
            this.data.taskAmount.TODO,
            this.data.taskAmount.PROGRESS,
            this.data.taskAmount.REVIEW,
            this.data.taskAmount.DONE,
            this.data.taskAmount.DELETED
          ],
          label: 'Task Amount',
          backgroundColor: [
            TaskStateColor.NONE,
            TaskStateColor.TODO,
            TaskStateColor.PROGRESS,
            TaskStateColor.REVIEW,
            TaskStateColor.DONE,
            TaskStateColor.DELETED
          ]
        }
      
      ],
      labels: [
      TaskState.NONE,
      TaskState.TODO,
      TaskState.PROGRESS,
      TaskState.REVIEW,
      TaskState.DONE,
      TaskState.DELETED
      ]
   }
  }

  getWipInfo() {
    if (this.data.wip > 1) {
      return this.translate.instant('STATS.WIP_INFO', { wip: this.data.wip });
    } else if (this.data.wip == 1) {
      return this.translate.instant('STATS.WIP_INFO_SINGLE');
    } else {
      return this.translate.instant('STATS.WIP_INFO_NONE');
    }
  }
}
