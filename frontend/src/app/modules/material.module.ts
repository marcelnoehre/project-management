import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [],
	imports: [
		MatSidenavModule,
		MatToolbarModule,
		MatMenuModule,
		MatListModule,
		MatSnackBarModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatOptionModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatTooltipModule
	],
	exports: [
		MatSidenavModule,
		MatToolbarModule,
		MatMenuModule,
		MatListModule,
		MatSnackBarModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatOptionModule,
		MatDialogModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatTooltipModule
	]
})
export class MaterialModule {}
