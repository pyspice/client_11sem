import { observer } from "mobx-react";
import * as React from "react";
import { ActionResult } from "../types";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";
import { DictLoader } from "./DictLoader";

type TryAgainPageProps = {
  onStartNewGame(words: string[], attempts: number): void;
};

@observer
export class TryAgainPage extends React.Component<TryAgainPageProps> {
  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  render() {
    return (
      <div>
        {this.message}
        <p>Увы, слова закончились</p>
        <DictLoader onStartNewGame={this.onStartNewGame} />
      </div>
    );
  }

  private get message() {
    const { currentMask, lastActionResult } = this.gameManager;
    if (!lastActionResult) return null;

    const message =
      lastActionResult === ActionResult.LOOSE
        ? "К сожалению, вы проиграли."
        : "Поздравляем, вы отгадали.";
    return (
      <p>
        {message} Слово: {currentMask}
      </p>
    );
  }

  private onStartNewGame = (words: string[], attempts: number) => {
    this.props.onStartNewGame(words, attempts);
  };
}
