import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { CovidService } from '../services/covid.service';

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

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      text: "Today",
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
  public stateLabels: Label[] = ['today'];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
    { data: [], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
    { data: [], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  ];

  //TOTAL

  public barChartOptionsTotal: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      text: "Total",
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
  public stateLabelsTotal: Label[] = ['total'];
  public barChartTypeTotal: ChartType = 'horizontalBar';
  public barChartLegendTotal = true;
  public barChartDataTotal: ChartDataSets[] = [
    { data: [], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
    { data: [], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
    { data: [], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  ];
  totalStateDetails: any[];
  index: number;


  constructor(private covid: CovidService) { }

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
    this.realStateObj = JSON.parse(this.stateObj);
    this.index = this.realStateObj.index;
    this.stateName = this.realStateObj.stateName;
    this.stateTodayDataArr = this.realStateObj.stateTodayDataArr;
    this.stateTotalDataArr = this.realStateObj.stateTotalDataArr;

    this.barChartData.map((data,index)=> { //today
      data.data = [this.stateTodayDataArr[index]];
    })
    this.barChartDataTotal.map((data,index)=> {  //total
      data.data = [this.stateTotalDataArr[index]];
    })
  }

}
