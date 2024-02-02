import { Component, OnInit } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  information = 'initialize';
  loading = 0;

  constructor(
    private stats: StatsService
  ) {

  }

  async ngOnInit(): Promise<void> {
    await new Promise<void>(done => setTimeout(() => done(), 250));
    this.stats.init();
    this.stats.getUpdateSubject().subscribe(async (res) => {
      await new Promise<void>(done => setTimeout(() => done(), 500));
      this.loading = res.percentage * 100;
      this.information = res.step;
      console.dir(res);
    });
  }

  loaded(): boolean {
    return this.loading === 100;
  }

}
