import { Component } from '@angular/core';
import * as io from "socket.io-client";
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'pollapp';  

  socket: SocketIOClient.Socket;
  pollObj: Object = {question: "", options: [1,2,3]};
  display: Boolean = false;
  voteDone: Boolean = false;
  value: number = 0;

  voteThanks: string = "";

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.listen2Events();
  }

  listen2Events() {
    this.socket.on("poll", data => {
      this.pollObj = data;
      this.display = true;
      this.pieChartLabels = [];
      this.pieChartData = [];
      for (let i = 0; i < data.options.length; i++){
        this.pieChartLabels.push(data.options[i].text);
        this.pieChartData.push(data.options[i].count);
      }
    });
    this.socket.on("thx", data => {
      this.voteThanks = data;
    })
  }

  vote(item) {
    this.socket.emit("newVote", item.value);
    this.voteDone = true;
  }

  radioVote() {
    this.socket.emit("newVote", this.value);
    this.voteDone = true;
  }

  selectValue(num) {
    this.value = num;
  }

}
