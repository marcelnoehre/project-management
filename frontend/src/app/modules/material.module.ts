import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [],
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule
    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule
    ]
})
export class MaterialModule {}
