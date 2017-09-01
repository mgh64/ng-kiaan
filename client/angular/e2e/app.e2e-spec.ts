import { NgKiaanPage } from './app.po';

describe('ng-kiaan App', () => {
  let page: NgKiaanPage;

  beforeEach(() => {
    page = new NgKiaanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
