import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { CovidService } from '../services/covid.service';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { NgAnimateScrollService } from 'ng-animate-scroll';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit, OnChanges {
  @Input('state') stateObj: string;
  private realStateObj;
  public stateTodayDataArr: any[] = [];
  public stateTotalDataArr: any[] = [];
  public stateName: string = '';
  public viewDistrict: boolean = false;
  //TODAY

  public pieChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Today's Cases"
    },
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Confirmed', 'Recovered', 'Deaths'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#F9E79F', '#82E0AA', '#F1948A'],
    },
  ];

  //TOTAL

  // public pieChartOptionsTotal: ChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   title: {
  //     display: true,
  //     text: "Total",
  //     fontSize: 18
  //   },
  //   legend: {
  //     labels: {
  //       fontColor: '#fffff',
  //       fontFamily: 'b612',
  //       fontSize: 13
  //     }
  //   },
  //   scales: { xAxes: [{}], yAxes: [{}] }
  // };
  // public pieChartLabelsTotal: Label[] = ['total'];
  // public pieChartTypeTotal: ChartType = 'pie';
  // public pieChartLegendTotal = true;
  // public pieChartDataTotal: ChartDataSets[] = [
  //   { data: [], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
  //   { data: [], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
  //   { data: [], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  // ];

  public pieChartOptionsTotal: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Total Cases'
    },
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabelsTotal: Label[] = ['Confirmed', 'Recovered', 'Deaths'];
  public pieChartDataTotal: number[] = [];
  public pieChartTypeTotal: ChartType = 'pie';
  public pieChartLegendTotal = true;
  public pieChartColorsTotal = [
    {
      backgroundColor: ['#F9E79F', '#82E0AA', '#F1948A'],
    },
  ];

  totalStateDetails: any[];
  index: number;


  constructor(private covid: CovidService, private animateScrollService: NgAnimateScrollService ) { }

  ngOnInit(): void {
    this.totalStateDetails = this.covid.getTotalStateCovid();
    console.log(this.totalStateDetails);
    this.storeStateData();
  }

  ngOnChanges() {
    this.storeStateData();
  }

  onMoreDetails() {
    this.viewDistrict = !this.viewDistrict;
  }

  private storeStateData() {
    this.animateScrollService.scrollToElement('more-btn', 1000);
    this.realStateObj = JSON.parse(this.stateObj);
    this.index = this.realStateObj.index;
    this.stateName = this.realStateObj.stateName;
    this.stateTodayDataArr = this.realStateObj.stateTodayDataArr;
    this.stateTotalDataArr = this.realStateObj.stateTotalDataArr;

    this.pieChartData = this.stateTodayDataArr;
    this.pieChartDataTotal = this.stateTotalDataArr;

    // this.pieChartDataTotal.map((data,index)=> {  //total
    //   data.data = [this.stateTotalDataArr[index]];
    // })
  }

}
