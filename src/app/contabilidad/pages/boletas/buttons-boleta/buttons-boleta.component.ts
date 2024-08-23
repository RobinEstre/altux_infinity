import {Component, Input, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-buttons-boleta',
  templateUrl: './buttons-boleta.component.html',
  styleUrls: ['./buttons-boleta.component.scss']
})
export class ButtonsBoletaComponent implements OnInit {
  @Output() emitter = new Subject<any>();

  @Input() actions!: Array<any>;
  @Input() data:any;

  constructor() { }

  ngOnInit(): void {
  }

  onActionClick(cmd: string): void {
    this.emitter.next({
      cmd: cmd,
      data: this.data
    });
  }

  onEditClick(): void {
    this.emitter.next({
      cmd: 'edit',
      data: this.data
    });
  }

  onDeleteClick(): void {
    this.emitter.next({
      cmd: 'delete',
      data: this.data
    });
  }

  ngOnDestroy(): void {
    this.emitter.unsubscribe();
  }
}
