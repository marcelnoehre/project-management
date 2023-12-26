import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from 'src/app/enums/permission.enum';
import { User } from 'src/app/interfaces/data/user';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  members: User[] = [];

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.api.getTeamMembers(this.getUser().project).subscribe(
      (users) => {
        this.members = users.sort((a, b) => (a.permission === Permission.ADMIN ? -1 : 1) - (b.permission === Permission.ADMIN ? -1 : 1));
      },
      (error) => {
        this.snackbar.open(this.translate.instant(error.error.message));
      }
    );
  }

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

}
