function makePasswordRegExp(patterns, min, max) {
  var min = min || ''; // Если минимальное число символов не указано, берём пустую строку
  var max = max || ''; // Если максимальное число символов не указано, берём пустую строку
  var regex_string = '';
  var rules = [];
  var range = '{' + min + ',' + max + '}'; // Разрешённый диапазон для длины строки
  for (var rule in patterns) {
    // Обрабатываем входящий массив из ВСЕХ правил для строки
    if (patterns.hasOwnProperty(rule)) {
      rules.push(patterns[rule]); // Запоминаем правила
      // Формируем последовательность из шаблонов (?=.*[%s])
      // Она проверит обязательное присутствие всех символов из входящего набора
      regex_string += '(?=.*[' + patterns[rule] + '])';
    }
  }
  // Добавляем в хвост набор из ВСЕХ разрешённых символов и разрешённую длину строки
  regex_string += '[' + rules.join('') + ']' + range;
  // Собираем всё в одно регулярное выражение
  return new RegExp(regex_string, 'g');
}

var patterns = {
  numeric: '0-9',
  special: '!@#$%^&*-.',
  latin_lower: 'a-z',
  latin_upper: 'A-Z',
};

// В вашем случае есть ограничение только по минимальной длине от 6 символов
var min = 6;

// Передаём правила в функцию и смотрим итоговое выражение
console.log(makePasswordRegExp(patterns, min));
