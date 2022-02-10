import { observer } from 'mobx-react';
import * as React from 'react';
import { Text, View } from 'react-native';
import { ActionResult } from '../utils/ActionResult';
import { GameManager } from '../utils/GameManager';
import { container } from '../utils/IoC/Container';
import { Services } from '../utils/IoC/Services';

@observer
export class TryAgainPage extends React.Component {
  private readonly gameManager = container.get<GameManager>(
    Services.GameManager,
  );

  render() {
    return (
      <View>
        {this.message}
        <Text>Увы, слова закончились</Text>
      </View>
    );
  }

  private get message() {
    const { currentMask, lastActionResult } = this.gameManager;
    if (!lastActionResult) return null;

    const message =
      lastActionResult === ActionResult.LOOSE
        ? 'К сожалению, вы проиграли.'
        : 'Поздравляем, вы отгадали.';
    return (
      <Text>
        {message} Слово: {currentMask}
      </Text>
    );
  }
}
