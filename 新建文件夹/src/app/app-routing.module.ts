import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsComponent } from './apps/apps.component';
import { RingComponent } from './ring/ring.component';
import { WaperComponent } from './waper/waper.component';
import { FirmwareComponent } from './firmware/firmware.component';

const routes: Routes = [
  { path: '', redirectTo: '/apps', pathMatch: 'full' },
  { path: 'apps', component: AppsComponent},
  { path: 'ring', component: RingComponent},
  { path: 'waper', component: WaperComponent},
  { path: 'firmware', component: FirmwareComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
