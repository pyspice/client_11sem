import * as React from "react";
import { DictLoader } from "./DictLoader";

type WelcomePageProps = {
  onStartGame(words: string[], attempts: number): void;
};

export class WelcomePage extends React.Component<WelcomePageProps> {
  render() {
    return (
      <div>
        <div>Добро пожаловать на Поле Чудес!</div>
        <div>
          <p>
            Слово зашифровано маской вида **а**ер (здесь зашифровано слово
            "драйвер").
          </p>
          <p>
            Для попытки отгадать букву введите её в поле ввода и нажмите кнопку
            "Отправить".
          </p>
          <p>ВНИМАНИЕ: вводить можно только русские буквы!</p>
        </div>
        <DictLoader onStartNewGame={this.onStartGame} />
      </div>
    );
  }

  private onStartGame = (words: string[], attempts: number) => {
    this.props.onStartGame(words, attempts);
  };
}
