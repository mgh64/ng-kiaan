import {ToasterConfig} from 'angular2-toaster';

export class MyToaster {

  public toasterconfig: ToasterConfig;

  public constructor() {
    this.toasterconfig = new ToasterConfig({
      positionClass: 'toast-bottom-left',
      timeout: 5000,
      animation: 'fadeOut',
      limit: 5
    });
  }

  public getConfig() {
    return this.toasterconfig;
  }
}
