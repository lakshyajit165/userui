import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserchatComponent, ReportDialog } from './userchat.component';

import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';

import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material';
import { MatDialogModule} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RatingModule } from 'ng-starrating';
import { UserchatService } from './userchat.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [UserchatComponent,
    ReportDialog
  ],
  providers: [UserchatService
  ],
  entryComponents: [ReportDialog],
  imports: [
    CommonModule,
    ToastrModule.forRoot({ timeOut: 3000 }),
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    HttpClientModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatChipsModule,
    MatGridListModule,
    MatSnackBarModule,
    MatDialogModule,
    HttpClientModule,
    RatingModule
  ],
  exports: [
    UserchatComponent,
    ReportDialog
  ]
})
export class UserchatModule { }
