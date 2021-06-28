import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import {LocationStrategy, HashLocationStrategy ,  APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppsComponent } from './apps/apps.component';
import { PageNavComponent } from './page-nav/page-nav.component';
import { AppDetailComponent } from './app-detail/app-detail.component';
import { BtnTotopComponent } from './btn-totop/btn-totop.component';
import { AppTablesComponent } from './app-tables/app-tables.component';
import { AppSpecialComponent } from './app-special/app-special.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RingComponent } from './ring/ring.component';
import { RingTableComponent } from './ring-table/ring-table.component';
import { DurationReformPipe } from './duration-reform.pipe';
import { SizeReformPipe } from './size-reform.pipe';
import { WaperComponent } from './waper/waper.component';
import { WaperTableComponent } from './waper-table/waper-table.component';
import { WaperViewerComponent } from './waper-viewer/waper-viewer.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AppReportComponent } from './app-report/app-report.component';
import { AppBannerComponent } from './app-banner/app-banner.component';
import { AppPhotosComponent } from './app-photos/app-photos.component';
import { ClarenceComponent } from './app-clarence/app-clarence';
import { AppDownloadButtonComponent } from './app-download-button/app-download-button.component';
import { DlogComponent } from './dlog/dlog.component';
import { PccService } from './pcc.service';
import { DlogService } from './dlog.service';
import { AppsService } from './apps.service';
import { RingsService } from './rings.service';
import { WapersService } from './wapers.service';
import { SearchInputComponent } from './search-input/search-input.component';
import { PageControllerComponent } from './page-controller/page-controller.component';
import { MessageComponent } from './message/message.component';
import { FirmwareComponent } from './firmware/firmware.component';
import { FirmwareTableComponent } from './firmware-table/firmware-table.component';
import { ErrorComponent } from './error/error.component';
import { DataStatusComponent } from './data-status/data-status.component';
import { HtmlPipe } from './html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AppsComponent,
    PageNavComponent,
    AppDetailComponent,
    BtnTotopComponent,
    AppTablesComponent,
    AppSpecialComponent,
    RingComponent,
    RingTableComponent,
    DurationReformPipe,
    SizeReformPipe,
    WaperComponent,
    WaperTableComponent,
    WaperViewerComponent,
    DropdownComponent,
    AppReportComponent,
    AppBannerComponent,
    AppPhotosComponent,
    AppDownloadButtonComponent,
    ClarenceComponent,
    DlogComponent,
    SearchInputComponent,
    PageControllerComponent,
    MessageComponent,
    FirmwareComponent,
    FirmwareTableComponent,
    ErrorComponent,
    DataStatusComponent,
    HtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [DlogService, PccService, AppsService, RingsService, WapersService,
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
