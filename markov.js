module.exports = class Markov {
  constructor(n) {
    this.data = {};
  }

  // データ登録
  add(words) {
    for (var i = 0; i <= words.length; i++) {
      var now = words[i];
      var prev = words[i - 1];
      if (this.data[prev] === undefined) {
        this.data[prev] = [];
      }
      this.data[prev].push(now);
    }
  }

  // 指定された文字に続く文字をランダムに返す
  sample(word) {
    var words = this.data[word];
    if (words === undefined) {
      words = [];
    }
    return words[Math.floor(Math.random() * words.length)];
  }

  // マルコフ連鎖でつなげた文字を返す
  make() {
    var sentences = [];
    var word = this.sample(undefined);
    while(word) {
      sentences.push(word);
      word = this.sample(word);
    }
    return sentences.join('');
  }
}
