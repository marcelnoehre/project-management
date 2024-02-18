import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { StatsService } from 'src/app/services/stats.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { TaskStateColor } from 'src/app/enums/task-state-color.enum';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from 'src/app/interfaces/chart-options';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  information = 'INIT';
  mode: ProgressBarMode = 'determinate';
  loading = 0;
  reload: any = {
    all: false,
    personalStats: false,
    stats: false,
    statLeaders: false,
    taskAmount: false,
    averageTime: false,
    wip: false,
    taskProgress: false,
    projectRoadmap: false
  };
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
  activeUnit = 'h';
  units = ['ms', 's', 'min', 'h', 'days'];
  unitFactor: any = {
    ms: 1,
    s: 0.001,
    min: 0.001 / 60,
    h: 0.001 / 3600,
    days: 0.001 / (3600 * 24)
  };  
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  chartOptions: ChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },
    xaxis: {
      type: "datetime",
      categories: []
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss'
      }
    }
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
        this.setupTaskProgress();
        this.information = res.information;
        this.mode = 'indeterminate';
        await new Promise<void>(done => setTimeout(() => done(), 2000));
        this.loading = res.percentage * 100;
      } else {
        await new Promise<void>(done => setTimeout(() => done(), 500));
        this.loading = res.percentage * 100;
        this.information = res.information;
        this.data[res.step] = res.data;
        if (res.step === 'taskProgress') {
          this.setupTaskProgress();
        }
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

  setUnit(unit: string) {
    this.activeUnit = unit;
  }

  averageTimeData() {
    return {
      data: [
        {
          data: [
            this.data.averageTime.NONE * this.unitFactor[this.activeUnit],
            this.data.averageTime.TODO * this.unitFactor[this.activeUnit],
            this.data.averageTime.PROGRESS * this.unitFactor[this.activeUnit],
            this.data.averageTime.REVIEW * this.unitFactor[this.activeUnit]
          ],
          label: 'Task Amount',
          backgroundColor: [
            TaskStateColor.NONE,
            TaskStateColor.TODO,
            TaskStateColor.PROGRESS,
            TaskStateColor.REVIEW
          ]
        }
      
      ],
      labels: [
        TaskState.NONE,
        TaskState.TODO,
        TaskState.PROGRESS,
        TaskState.REVIEW
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

  setupTaskProgress() {
    const states = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];
    states.forEach((state) => {
      this.chartOptions.series.push({
        name: state,
        data: this.data.taskProgress[state]
      });
    });
    this.chartOptions.xaxis = this.data.taskProgress.timestamp;
  }

  isLoading(stat: string): boolean {
    return this.reload[stat];
  }

  highlightActiveUnit(unit: string): boolean {
    return this.activeUnit === unit;
  }

  regenerateAll() {
    this.stats.regenerateAll();
  }

  async regenerateStat(stat: string) {
    this.data[stat] = await this.stats.regenerateStat(stat);
    if (stat === 'taskProgress') {
      const series: ApexAxisChartSeries = [];
      const states = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];
      states.forEach((state) => {
        series.push({
          name: state,
          data: this.data.taskProgress[state]
        });
      });
      this.chart.updateSeries(series);
    }
  }

}
