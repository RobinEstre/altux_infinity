import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare var $: any

@Component({
  selector: 'app-columnresizer',
  templateUrl: './columnresizer.component.html',
  styleUrls: ['./columnresizer.component.scss']
})
export class ColumnresizerComponent implements OnInit {

  @Input() scale: number | undefined = 4;
  @Output() changed = new EventEmitter<any>();

  constructor(private _host: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  updated(scale: number) {
    var windowwidth = $(window).width();
    const closetParent = $(this._host.nativeElement).closest('.column-set');

    this.scale = scale;
    this.changed.emit(scale);

    if (windowwidth >= 1400) {
      closetParent.removeClass(function (index: any, css: any) { return (css.match(/(^|\s)col-xxl-\S+/g) || []).join(' '); })
      closetParent.addClass('col-xxl-' + this.scale)
    }
    else if (windowwidth < 1400 && windowwidth >= 1200) {
      closetParent.removeClass(function (index: any, css: any) { return (css.match(/(^|\s)col-xl-\S+/g) || []).join(' '); })
      closetParent.addClass('col-xl-' + this.scale)

    } else if (windowwidth < 1200 && windowwidth >= 992) {
      closetParent.removeClass(function (index: any, css: any) { return (css.match(/(^|\s)col-lg-\S+/g) || []).join(' '); })
      closetParent.addClass('col-lg-' + this.scale)

    } else if (windowwidth < 992 && windowwidth >= 768) {
      closetParent.removeClass(function (index: any, css: any) { return (css.match(/(^|\s)col-md-\S+/g) || []).join(' '); })
      closetParent.addClass('col-md-' + this.scale)

    } else if (windowwidth < 768 && windowwidth >= 576) {
      closetParent.removeClass(function (index: any, css: any) { return (css.match(/(^|\s)col-sm-\S+/g) || []).join(' '); })
      closetParent.addClass('col-sm-' + this.scale)

    } else if (windowwidth < 576) {
      closetParent.removeClass(function (index: any, css: any) { return (css.match(/(^|\s)col-\S+/g) || []).join(' '); })
      closetParent.addClass('col-' + this.scale)
    }
  }

}
