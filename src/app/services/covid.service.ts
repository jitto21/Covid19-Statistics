import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { combineLatest, BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CovidService {

  yesterdayStateDetails: any[] = [];
  totalStateDetails: any[] = [];
  //today
  todayConfirmedArr: number[] = []
  todayDeathArr: number[] = [];
  todayDischargedArr: number[] = [];
  // total
  totalConfirmedArr: number[] = []
  totalDeathArr: number[] = [];
  totalDischargedArr: number[] = [];
  todayDataArr;

  private dataArrSub = new Subject<any[]>();
  index: number;
  private lastRefreshedDate: any;

  constructor(private http: HttpClient) {}

  getLastRefreshed() {
    return this.lastRefreshedDate;
  }

  getStateCode() {
    return this.http.get('https://api.covid19india.org/states_daily.json')
    .pipe(map((res: any)=> {
      return Object.keys(res.states_daily[0]);
    }));
  }

  getCovidDetails() {
    return this.http.get('https://api.rootnet.in/covid19-in/stats/latest').pipe(map((res: any)=> {
      return {
        statesArr: res.data.regional,
        lastRefreshed: res.lastRefreshed,
        summary: res.data.summary
      }
    }))
  }

  getTodayCovid() {

    let date = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000 ));
    let today = date.toISOString().split("T")[0]; //todays date
    console.log(today);

    let totalCovidObs = this.http.get('https://api.rootnet.in/covid19-in/stats/history').pipe(map((res: any)=> {
      console.log(res);
      if(res.success == true) {
        this.lastRefreshedDate = res.lastRefreshed.split('T')[0];
        let totalDetails = res.data.find(oneDay=> {
          return oneDay.day == this.lastRefreshedDate;
        })
        console.log(totalDetails);
        return totalDetails;
      }
    }))

    totalCovidObs.subscribe(res=> {
      console.log(res);
      this.totalStateDetails = res.regional;
      console.log(this.totalStateDetails);
    })

    let yesterdayCovidObs = this.http.get('https://api.rootnet.in/covid19-in/stats/history').pipe(map((res: any)=> {
      if(res.success == true) {
        let date = new Date(res.lastRefreshed);
        let yesterday = new Date(date.setDate(date.getDate()- 1)).toISOString().split("T")[0]; //previous date from lastRefreshed Date
        console.log(yesterday);
        let yesterdayDetails = res.data.find(oneDay=> {
          return oneDay.day == yesterday  //dynaically get yestreday's date
        })
        return yesterdayDetails;
      }
    }));

    yesterdayCovidObs.subscribe(res=> {
      console.log(res);
      this.yesterdayStateDetails = res.regional;
      console.log(this.yesterdayStateDetails)
    })
    return combineLatest(totalCovidObs, yesterdayCovidObs ,()=>({}) )
    .subscribe(res=> {
      console.log("two obs have completed");
      this.totalStateDetails.forEach((todayState, index)=> {
        //today's
        this.todayConfirmedArr.push(todayState.totalConfirmed - this.yesterdayStateDetails[index].totalConfirmed);
        this.todayDischargedArr.push(todayState.discharged - this.yesterdayStateDetails[index].discharged);
        this.todayDeathArr.push(todayState.deaths - this.yesterdayStateDetails[index].deaths);
        //total
        this.totalConfirmedArr.push(todayState.totalConfirmed);
        this.totalDischargedArr.push(todayState.discharged);
        this.totalDeathArr.push(todayState.deaths);
      });
      this.todayDataArr = new Array(this.todayConfirmedArr, this.todayDischargedArr, this.todayDeathArr); //array of confirmed, discharged and deaths of today
      console.log(" Service: Todays Confirmed :: ", this.todayDataArr);
      this.dataArrSub.next(this.todayDataArr);
    });
  }

  getDataArrAsObs() {
    return this.dataArrSub.asObservable();
  }

  getStateToday(index: number) { //returns confirmed, discharged and death data for a particular state
    console.log(index);
    this.index = index;
    return {
      today:[
        this.todayConfirmedArr[index],
        this.todayDischargedArr[index],
        this.todayDeathArr[index]
      ],
      total: [
        this.totalConfirmedArr[index],
        this.totalDischargedArr[index],
        this.totalDeathArr[index]
      ]
    }
  }

  getTotalStateCovid() {
    return this.totalStateDetails;
  }

  getDistrictCovid() {
    return this.http.get('https://api.covid19india.org/state_district_wise.json')
    .pipe(map(res=> {
       return Object.values(res).slice(1);
    }))

  }

}

