import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { ChartModel } from '../_interfaces/chartmodel';



@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  public data: ChartModel[];
  public connectionId : string;
  public bradcastedData: ChartModel[];

  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/chart')
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }

  public addGroupMessageListener = () => {
    this.hubConnection.on('groupmessage', (data) => {
      window.alert(data);
      console.log(data);
    });
  }

  public getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid').then(
      (data) => {
        console.log(data);
          this.connectionId = data;
        }
    ); 
  }

  
  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastchartdata', this.data, this.connectionId)
    .catch(err => console.error(err));
  }


  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }

  constructor() { }
}
