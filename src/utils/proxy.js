export default class {
  constructor(url) {
    this.url = url;
  }

  getResWithoutHash() {
    return `https://allorigins.hexlet.app/get?disableCache=true&url=${this.url}`;
  }
}
