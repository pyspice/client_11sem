import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { ActionResult } from "../utils/ActionResult";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";

type RoundProps = {
  onTryLetter(letter: string): void;
  onSurrender(): void;
};

@observer
export class Round extends React.Component<RoundProps> {
  private letter = observable.box<string>("");

  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  render() {
    const letter = this.letter.get();
    return (
      <div>
        <div>Текущая маска: {this.gameManager.currentMask}</div>
        {this.lastActionMsg}
        <div>Попыток осталось: {this.gameManager.attemptsLeft}</div>
        <input
          type="text"
          value={letter}
          maxLength={1}
          onChange={this.onChange}
          autoFocus
          onKeyPress={this.onKeyPress}
        />
        <button
          onClick={this.onTryLetter}
          disabled={letter.length < 1}
        >
          Отправить
        </button>
        <button onClick={this.onSurrender}>Сдаться</button>
      </div>
    );
  }

  private get lastActionMsg() {
    const { lastActionResult } = this.gameManager;
    if (lastActionResult == undefined) return null;

    let msg = "";
    switch (lastActionResult) {
      case ActionResult.FAIL:
        msg = "Не угадали. Попробуйте еще раз!";
        break;

      case ActionResult.OK:
        msg = "Верно! Так держать!";
        break;

      case ActionResult.USED:
        msg = "Внимательнее! Эта буква уже была.";
    }
    return <div>{msg}</div>;
  }

  private onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && this.letter.get().length > 0) {
      this.onTryLetter();
    }
  };

  @action
  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const letter = event.target.value;
    if (letter && !letter.match(/[а-яА-ЯёЁ]/g)) return;
    this.letter.set(event.target.value);
  };

  private onTryLetter = () => {
    this.props.onTryLetter(this.letter.get());
    this.letter.set("");
  };

  private onSurrender = () => {
    this.props.onSurrender();
  };
}
