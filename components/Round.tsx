import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { ActionResult } from '../utils/ActionResult';
import { GameManager } from '../utils/GameManager';
import { container } from '../utils/IoC/Container';
import { Services } from '../utils/IoC/Services';

type RoundProps = {
  onTryLetter(letter: string): void;
  onSurrender(): void;
};

@observer
export class Round extends React.Component<RoundProps> {
  private letter = observable.box<string>('');

  private readonly gameManager = container.get<GameManager>(
    Services.GameManager,
  );

  render() {
    const letter = this.letter.get();
    return (
      <View>
        <Text>Текущая маска: {this.gameManager.currentMask}</Text>
        {this.lastActionMsg}
        <Text>Попыток осталось: {this.gameManager.attemptsLeft}</Text>
        <TextInput
          value={letter}
          maxLength={1}
          onChangeText={this.onChange}
          autoFocus
          placeholder="Введите букву"
          onEndEditing={this.onEndEditing}
        />
        <Button
          title="Отправить"
          onPress={this.onTryLetter}
          disabled={letter.length < 1}
        />
        <Button title="Сдаться" onPress={this.onSurrender} />
      </View>
    );
  }

  private get lastActionMsg() {
    const { lastActionResult } = this.gameManager;
    if (lastActionResult == undefined) return null;

    let msg = '';
    switch (lastActionResult) {
      case ActionResult.FAIL:
        msg = 'Не угадали. Попробуйте еще раз!';
        break;

      case ActionResult.OK:
        msg = 'Верно! Так держать!';
        break;

      case ActionResult.USED:
        msg = 'Внимательнее! Эта буква уже была.';
    }
    return <Text>{msg}</Text>;
  }
  
  private onEndEditing = () => {
    if (this.letter.get().length > 0) {
      this.onTryLetter();
    }
  };

  @action
  private onChange = (letter: string) => {
    if (letter && !letter.match(/[а-яА-ЯёЁ]/g)) return;
    this.letter.set(letter);
  };

  private onTryLetter = () => {
    this.props.onTryLetter(this.letter.get());
    this.letter.set('');
  };

  private onSurrender = () => {
    this.props.onSurrender();
  };
}
