import * as React from 'react';
import { observer } from 'mobx-react';
import { GameManager, GameManagerState } from '../utils/GameManager';
import { container } from '../utils/IoC/Container';
import { Services } from '../utils/IoC/Services';
import {
  ClientAction,
  RequestSender,
  ServerState,
  ServerStateLabel,
} from '../utils/RequestSender';
import { WelcomePage } from './WelcomePage';
import { Round } from './Round';
import { RoundEnd } from './RoundEnd';
import { TryAgainPage } from './TryAgainPage';
import { Text, View } from 'react-native';

@observer
export class Game extends React.Component {
  private readonly gameManager = container.get<GameManager>(
    Services.GameManager,
  );
  private readonly requestSender = container.get<RequestSender>(
    Services.RequestSender,
  );

  componentDidMount() {
    this.fetchAndUpdateState();
  }

  render() {
    return <View>{this.content}</View>;
  }

  private get content() {
    if (!this.gameManager.wasInited) {
      return <Text>Now loading...</Text>;
    }

    switch (this.gameManager.state) {
      case GameManagerState.BEFORE_START:
        return <WelcomePage />;
      case GameManagerState.ROUND_RUNNING:
        return (
          <Round
            onTryLetter={this.onTryLetter}
            onSurrender={this.onSurrender}
          />
        );
      case GameManagerState.ROUND_ENDED:
        return <RoundEnd onStartNewRound={this.onStartNewRound} />;
      case GameManagerState.AFTER_END:
        return <TryAgainPage />;
    }
  }

  private fetchAndUpdateState = async () => {
    const serverState = await this.requestSender.fetchState();
    this.updateState(serverState);
  };

  private updateState = (serverState: ServerState) => {
    if (
      serverState.state === ServerStateLabel.ROUND_ENDED &&
      !serverState.wordsLeft
    ) {
      this.gameManager.endGame();
      return;
    }

    const { state, word, attempts } = serverState;
    this.gameManager.init(state as any, word, attempts);
  };

  private onStartNewRound = async () => {
    const { word, attempts } = await this.requestSender.postAction({
      action: ClientAction.NEXT_ROUND,
    });
    this.gameManager.startRound(word, attempts);
  };

  private onTryLetter = async (letter: string) => {
    const response = await this.requestSender.postAction({
      action: ClientAction.TRY,
      letter,
    });

    this.gameManager.onAttemptMade(response);
  };

  private onSurrender = async () => {
    const { action, word, wordsLeft } = await this.requestSender.postAction({
      action: ClientAction.SURRENDER,
    });

    if (wordsLeft) this.gameManager.endRound(word, action);
    else this.gameManager.endGame(word, action);
  };
}
