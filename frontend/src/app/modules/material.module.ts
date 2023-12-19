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
        MatInputModule
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
        MatInputModule
    ]
})
export class MaterialModule {}
