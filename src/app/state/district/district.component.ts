import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { CovidService } from 'src/app/services/covid.service';
import { NgAnimateScrollService } from 'ng-animate-scroll';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit, OnChanges {

  @Input() index: number;
  districtNameArr: string[] = [];
  confirmedArr: number[] = [];
  activeArr: number[] = []
  dischargedArr: number[] = []
  deathArr: number[] = []
  eachDistrictData: any[] = [];

  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   title: {
  //     display: true,
  //     text: "Districts",
  //     fontSize: 15
  //   },
  //   legend: {
  //     labels: {
  //       fontColor: '#fffff',
  //       fontFamily: 'b612',
  //       fontSize: 12
  //     }
  //   },
  //   scales: { xAxes: [{}], yAxes: [{}] }
  // };
  // public districtLabels: Label[] = ['red'];
  // public barChartType: ChartType = 'horizontalBar';
  // public barChartLegend = true;
  // public barChartData: ChartDataSets[] = [
  //   { data: [1], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
  //   { data: [1], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
  //   { data: [1], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  // ];

  constructor(private covid: CovidService, private animateScrollService: NgAnimateScrollService) { }

  ngOnInit(): void {
    this.storeData();
  }

  ngOnChanges() {
    this.storeData();
  }

  storeData() {
    // this.animateScrollService.scrollToElement('district-table', 800);
    this.covid.getDistrictCovid()
    .subscribe(res=> {
      console.log(res);
      this.districtNameArr = Object.keys(res[this.index].districtData); //creates the name array of districts
      this.eachDistrictData = Object.values(res[this.index].districtData); //creates array of {active: number, confirmed: number, recovered: number, death: number} of districts
      console.log(this.eachDistrictData);
      console.log("Districts :: " ,this.districtNameArr);
    });
  }

}
