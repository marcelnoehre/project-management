import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [],
    imports: [
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule
    ],
    exports: [
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule
    ]
})
export class MaterialModule {}
