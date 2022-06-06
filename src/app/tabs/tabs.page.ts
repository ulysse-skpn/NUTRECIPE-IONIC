import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage implements OnInit {

  visible:boolean = false

  ngOnInit(): void 
  {
    if( sessionStorage.getItem("access_token") ) this.visible = true
  }

}
