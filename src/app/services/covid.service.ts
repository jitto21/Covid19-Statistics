import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { combineLatest, BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CovidService {

  yesterdayStateDetails: any[] = [];
  todayStateDetails: any[] = [];
  todayConfirmedArr: number[] = []
  todayDeathArr: number[] = [];
  todayDischargedArr: number[] = [];
  todayDataArr;

  private dataArrSub = new Subject<any[]>();

  // todayStateDetails: any;
  // yesterdayStateDetails: any;
  constructor(private http: HttpClient) {}

  getCovidDetails() {
    return this.http.get('https://api.rootnet.in/covid19-in/stats/latest').pipe(map((res: any)=> {
      return {
        statesArr: res.data.regional,
        lastRefreshed: res.lastRefreshed,
        summary: res.data.summary
      }
    }))
  }

  // getTodayCovid() { //getLatest

  // }

  // getYesterdayCovid() {

  // }

  getTodayCovid() {

    let date = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000 ));
    let today = date.toISOString().split("T")[0];; //todays date

    let todayCovidObs = this.http.get('https://api.rootnet.in/covid19-in/stats/history').pipe(map((res: any)=> {
      if(res.success == true) {
        let todayDetails = res.data.find(oneDay=> {
          return oneDay.day == today
        })
        return todayDetails;
      }
    }))

    todayCovidObs.subscribe(res=> {
      console.log(res);
      this.todayStateDetails = res.regional;
      console.log(this.todayStateDetails);
    })

    let yesterday = new Date(date.setDate(date.getDate()- 1)).toISOString().split("T")[0];; //yesterday date

    let yesterdayCovidObs = this.http.get('https://api.rootnet.in/covid19-in/stats/history').pipe(map((res: any)=> {
      if(res.success == true) {
        let yesterdayDetails = res.data.find(oneDay=> {
          return oneDay.day == yesterday
        })
        return yesterdayDetails;
      }
    }));

    yesterdayCovidObs.subscribe(res=> {
      console.log(res);
      this.yesterdayStateDetails = res.regional;
      console.log(this.yesterdayStateDetails)
    })
    return combineLatest(todayCovidObs, yesterdayCovidObs ,()=>({}) )
    .subscribe(res=> {
      console.log("two obs have completed");
      this.todayStateDetails.forEach((todayState, index)=> {
        this.todayConfirmedArr.push(todayState.totalConfirmed - this.yesterdayStateDetails[index].totalConfirmed);
        this.todayDischargedArr.push(todayState.discharged - this.yesterdayStateDetails[index].discharged)
        this.todayDeathArr.push(todayState.deaths - this.yesterdayStateDetails[index].deaths)
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
    return [
      this.todayConfirmedArr[index],
      this.todayDischargedArr[index],
      this.todayDeathArr[index]
    ]
  }

}

