import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public chartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartLabels: string[] = ['Real time data for the chart'];
  public chartType: string = 'bar';
  public chartLegend: boolean = true;
  public colors: any[] = [{ backgroundColor: '#5491DA' }, { backgroundColor: '#E74C3C' }, { backgroundColor: '#82E0AA' }, { backgroundColor: '#E5E7E9' }]
  
  constructor(public signalRService: SignalRService, private http: HttpClient) { }
  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();   
    this.signalRService.addBroadcastChartDataListener();
    this.signalRService.addGroupMessageListener();
    this.startHttpRequest();
    this.subscribeToGroup(10);
  }
  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/chart')
      .subscribe(res => {
        console.log(res);
      })
  }

  private subscribeToGroup= (idGroup: Number) => {
    if(this.signalRService.connectionId == undefined){
      setTimeout(() => {
        this.subscribeToGroup(idGroup);
    }, 2000);
      
     
    }else{
        this.http.get('https://localhost:5001/api/chart/subscribe/' + idGroup + "/" + this.signalRService.connectionId)
          .subscribe(res => {
            console.log(res);
          })
    }
  }

  public chartClicked = (event) => {
    console.log(event);
    this.signalRService.broadcastChartData();
  }
}
