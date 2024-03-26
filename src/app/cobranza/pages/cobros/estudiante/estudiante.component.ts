import { Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import {DatePipe, registerLocaleData} from "@angular/common";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class EstudianteComponent implements OnInit {

  constructor() { }

  @Input()report_student:any;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    /* footable */
    /* table data master */
    $('.footable').footable({
      "paging": {
        "enabled": true,
        "container": '#footable-pagination',
        "countFormat": "{CP} of {TP}",
        "limit": 3,
        "position": "right",
        "size": 7
      },
      "sorting": {
        "enabled": true
      },
    }, function (ft: any) {
      $('#footablestot').html($('.footable-pagination-wrapper .label').html())

      $('.footable-pagination-wrapper ul.pagination li').on('click', function () {
        setTimeout(function () {
          $('#footablestot').html($('.footable-pagination-wrapper .label').html());
        }, 200);
      });

    });

    var chosensimple: any = $('.chosenoptgroup')
    chosensimple.chosen().on('load change', function (event: any, el: any) {
      var textdisplay_element = $(".chosenoptgroup + .chosen-container .chosen-single > span");
      var selected_element = $(".chosenoptgroup option:selected");
      var selected_value = selected_element.val();
      if (selected_element.closest('optgroup').length > 0) {
        var parent_optgroup = selected_element.closest('optgroup').attr('label');
        textdisplay_element.text(parent_optgroup + ' ' + selected_value).trigger("chosen:updated");
      }
    });
  }
}
