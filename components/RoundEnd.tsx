import { observer } from 'mobx-react';
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { ActionResult } from '../utils/ActionResult';
import { GameManager } from '../utils/GameManager';
import { container } from '../utils/IoC/Container';
import { Services } from '../utils/IoC/Services';

type RoundEndProps = {
  onStartNewRound(): void;
};

@observer
export class RoundEnd extends React.Component<RoundEndProps> {
  private readonly gameManager = container.get<GameManager>(
    Services.GameManager,
  );

  render() {
    return (
      <View>
        {this.message}
        <Button title="Следующий раунд" onPress={this.onStartNewRound} />
      </View>
    );
  }

  private get message() {
    const { currentMask, lastActionResult } = this.gameManager;
    if (!lastActionResult) return <Text>Поиграем еще?</Text>;

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

  private onStartNewRound = () => {
    this.props.onStartNewRound();
  };
}
