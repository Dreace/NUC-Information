const pinyin_dict_firstletter = require("pinyin_dict_firstletter.js")
var toneMap = {
  "ā": "a1",
  "á": "a2",
  "ǎ": "a3",
  "à": "a4",
  "ō": "o1",
  "ó": "o2",
  "ǒ": "o3",
  "ò": "o4",
  "ē": "e1",
  "é": "e2",
  "ě": "e3",
  "è": "e4",
  "ī": "i1",
  "í": "i2",
  "ǐ": "i3",
  "ì": "i4",
  "ū": "u1",
  "ú": "u2",
  "ǔ": "u3",
  "ù": "u4",
  "ü": "v0",
  "ǖ": "v1",
  "ǘ": "v2",
  "ǚ": "v3",
  "ǜ": "v4",
  "ń": "n2",
  "ň": "n3",
  "": "m2"
};
var dict = {};
var pinyinUtil = {
  parseDict: function() {
    dict.firstletter = pinyin_dict_firstletter.pinyin_dict_firstletter
  },
  getPinyin: function(chinese, splitter, withtone, polyphone) {
    if (!chinese || /^ +$/g.test(chinese)) return '';
    splitter = splitter == undefined ? ' ' : splitter;
    withtone = withtone == undefined ? true : withtone;
    polyphone = polyphone == undefined ? false : polyphone;
    var result = [];
    if (dict.withtone) {
      var noChinese = '';
      for (var i = 0,
          len = chinese.length; i < len; i++) {
        var pinyin = dict.withtone[chinese[i]];
        if (pinyin) {
          if (!polyphone) pinyin = pinyin.replace(/ .*$/g, '');
          if (!withtone) pinyin = this.removeTone(pinyin);
          noChinese && (result.push(noChinese), noChinese = '');
          result.push(pinyin)
        } else if (!chinese[i] || /^ +$/g.test(chinese[i])) {
          noChinese && (result.push(noChinese), noChinese = '')
        } else {
          noChinese += chinese[i]
        }
      }
      if (noChinese) {
        result.push(noChinese);
        noChinese = ''
      }
    } else if (dict.notone) {
      if (withtone) console.warn('pinyin_dict_notone 字典文件不支持声调！');
      if (polyphone) console.warn('pinyin_dict_notone 字典文件不支持多音字！');
      var noChinese = '';
      for (var i = 0,
          len = chinese.length; i < len; i++) {
        var temp = chinese.charAt(i),
          pinyin = dict.notone[temp];
        if (pinyin) {
          noChinese && (result.push(noChinese), noChinese = '');
          result.push(pinyin)
        } else if (!temp || /^ +$/g.test(temp)) {
          noChinese && (result.push(noChinese), noChinese = '')
        } else {
          noChinese += temp
        }
      }
      if (noChinese) {
        result.push(noChinese);
        noChinese = ''
      }
    } else {
      throw '抱歉，未找到合适的拼音字典文件！';
    }
    if (!polyphone) return result.join(splitter);
    else {
      if (window.pinyin_dict_polyphone) return parsePolyphone(chinese, result, splitter, withtone);
      else return handlePolyphone(result, ' ', splitter)
    }
  },
  getFirstLetter: function(str, polyphone) {
    polyphone = polyphone == undefined ? false : polyphone;
    if (!str || /^ +$/g.test(str)) return '';
    if (dict.firstletter) {
      var result = [];
      for (var i = 0; i < str.length; i++) {
        var unicode = str.charCodeAt(i);
        var ch = str.charAt(i);
        if (unicode >= 19968 && unicode <= 40869) {
          ch = dict.firstletter.all.charAt(unicode - 19968);
          if (polyphone) ch = dict.firstletter.polyphone[unicode] || ch
        }
        result.push(ch)
      }
      if (!polyphone) return result.join('');
      else return handlePolyphone(result, '', '')
    } else {
      var py = this.getPinyin(str, ' ', false, polyphone);
      py = py instanceof Array ? py : [py];
      var result = [];
      for (var i = 0; i < py.length; i++) {
        result.push(py[i].replace(/(^| )(\w)\w*/g,
          function(m, $1, $2) {
            return $2.toUpperCase()
          }))
      }
      if (!polyphone) return result[0];
      else return simpleUnique(result)
    }
  },
  getHanzi: function(pinyin) {
    if (!dict.py2hz) {
      throw '抱歉，未找到合适的拼音字典文件！';
    }
    return dict.py2hz[this.removeTone(pinyin)] || ''
  },
  getSameVoiceWord: function(hz, sameTone) {
    sameTone = sameTone || false
    return this.getHanzi(this.getPinyin(hz, ' ', false))
  },
  removeTone: function(pinyin) {
    return pinyin.replace(/[āáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜńň]/g,
      function(m) {
        return toneMap[m][0]
      })
  },
  getTone: function(pinyinWithoutTone) {
    var newToneMap = {};
    for (var i in toneMap) newToneMap[toneMap[i]] = i;
    return (pinyinWithoutTone || '').replace(/[a-z]\d/g,
      function(m) {
        return newToneMap[m] || m
      })
  }
};

function handlePolyphone(array, splitter, joinChar) {
  splitter = splitter || '';
  var result = [''],
    temp = [];
  for (var i = 0; i < array.length; i++) {
    temp = [];
    var t = array[i].split(splitter);
    for (var j = 0; j < t.length; j++) {
      for (var k = 0; k < result.length; k++) temp.push(result[k] + (result[k] ? joinChar : '') + t[j])
    }
    result = temp
  }
  return simpleUnique(result)
}

function parsePolyphone(chinese, result, splitter, withtone) {
  var poly = window.pinyin_dict_polyphone;
  var max = 7;
  var temp = poly[chinese];
  if (temp) {
    temp = temp.split(' ');
    for (var i = 0; i < temp.length; i++) {
      result[i] = temp[i] || result[i];
      if (!withtone) result[i] = pinyinUtil.removeTone(result[i])
    }
    return result.join(splitter)
  }
  for (var i = 0; i < chinese.length; i++) {
    temp = '';
    for (var j = 0; j < max && (i + j) < chinese.length; j++) {
      if (!/^[\u2E80-\u9FFF]+$/.test(chinese[i + j])) break;
      temp += chinese[i + j];
      var res = poly[temp];
      if (res) {
        res = res.split(' ');
        for (var k = 0; k <= j; k++) {
          if (res[k]) result[i + k] = withtone ? res[k] : pinyinUtil.removeTone(res[k])
        }
        break
      }
    }
  }
  for (var i = 0; i < result.length; i++) {
    result[i] = result[i].replace(/ .*$/g, '')
  }
  return result.join(splitter)
}

function simpleUnique(array) {
  var result = [];
  var hash = {};
  for (var i = 0; i < array.length; i++) {
    var key = (typeof array[i]) + array[i];
    if (!hash[key]) {
      result.push(array[i]);
      hash[key] = true
    }
  }
  return result
}
pinyinUtil.parseDict();
pinyinUtil.dict = dict;
module.exports.pinyinUtil = pinyinUtil;