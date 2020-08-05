import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { CovidService } from '../services/covid.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  @Input() state: string = '';

  //TODAY

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      text: "Today's Covid19 Statistics",
      fontSize: 18
    },
    legend: {
      labels: {
        fontColor: '#fffff',
        fontFamily: 'b612',
        fontSize: 13
      }
    },
    scales: { xAxes: [{}], yAxes: [{}] }
  };
  public stateLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [2233], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
    { data: [1200], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
    { data: [100], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  ];

  //TOTAL

  public barChartOptionsTotal: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      text: "Today's Covid19 Statistics",
      fontSize: 18
    },
    legend: {
      labels: {
        fontColor: '#fffff',
        fontFamily: 'b612',
        fontSize: 13
      }
    },
    scales: { xAxes: [{}], yAxes: [{}] }
  };
  public stateLabelsTotal: Label[] = [];
  public barChartTypeTotal: ChartType = 'horizontalBar';
  public barChartLegendTotal = true;
  public barChartDataTotal: ChartDataSets[] = [
    { data: [2233], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
    { data: [1200], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
    { data: [100], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  ];


  constructor(private covid: CovidService) { }

  ngOnInit(): void {

  }

}
