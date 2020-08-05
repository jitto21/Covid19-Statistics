import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CovidService } from '../services/covid.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { combineAll } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  @Output() stateEvent = new EventEmitter<string>();

  todayDataArr: any[] = [];

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
    scales: { xAxes: [{}], yAxes: [{ticks: {min:0, stepSize: 700, max: 14000}}] }
  };

  // public confirmedArr: number[] = [];
  // public deathArr: number[] = [];
  // public recoveredArr: number[] = [];

  todayConfirmedArr: any[] = []
  todayDeathArr: any[] = [];
  todayDischargedArr: any[] = [];

  public stateLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Confirmed Cases', backgroundColor: '#F9E79F', hoverBackgroundColor: '#F7DC6F'  },
        { data: [], label: 'Discharged', backgroundColor: ' #82E0AA', hoverBackgroundColor: '#58D68D' },
        { data: [], label: 'Deaths', backgroundColor: '#F1948A', hoverBackgroundColor: '#C0392B' }
  ];
  todayDataArrSub: Subscription;

  constructor(private covid: CovidService) { }

  ngOnInit(): void {
    this.covid.getCovidDetails()
    .subscribe((res: any)=> {
      res.statesArr.forEach((state: any)=> {
        this.stateLabels.push(state.loc);
      });
    });

    // this.covid.getStateCode()
    // .subscribe(res=> {
    //   console.log(res);
    //   this.stateLabels = res.filter(data=>{
    //     return (data !== 'date' && data !== 'status')
    //   });
    // });

    this.covid.getTodayCovid();
    this.todayDataArrSub = this.covid.getDataArrAsObs()
    .subscribe(res=> {
      // console.log(res);
      this.todayDataArr = res;
      console.log("Todays Data :: ", this.todayDataArr);
      this.barChartData.forEach((data, index)=>{ //pushing to bar chart data array
        data.data = this.todayDataArr[index];
      })
    })
  }

  chartClicked(event) {
    let stateDataArrays = this.covid.getStateToday(event.active[0]._index); //gets confirmed, discharged and death data for a particular state
    // console.log(stateDataArr);
    console.log(event);
    let stateObj = {
      stateName: event.active[0]._view.label,
      stateTodayDataArr: stateDataArrays.today,
      stateTotalDataArr:  stateDataArrays.total,
      index: event.active[0]._index
    }
    this.stateEvent.emit(JSON.stringify(stateObj));
  }

  ngOnDestroy() {
    this.todayDataArrSub.unsubscribe();
  }

}
