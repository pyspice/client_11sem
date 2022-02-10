import * as React from 'react';
import { Text, View } from 'react-native';

export function WelcomePage() {
  return (
    <View>
      <Text>Добро пожаловать на Поле Чудес!</Text>
      <Text>
        Слово зашифровано маской вида **а**ер (здесь зашифровано слово
        "драйвер").
      </Text>
      <Text>
        Для попытки отгадать букву введите её в поле ввода и нажмите кнопку
        "Отправить".
      </Text>
      <Text>ВНИМАНИЕ: вводить можно только русские буквы!</Text>
      <Text>Администратор еще не загрузил слова для игры :(</Text>
    </View>
  );
}
