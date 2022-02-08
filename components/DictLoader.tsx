import * as React from "react";
import { action, observable } from "mobx";
import { observer } from "mobx-react";

type DictLoaderProps = {
  onStartNewGame(words: string[], attempts: number): void;
};

@observer
export class DictLoader extends React.Component<DictLoaderProps> {
  private words = observable.array<string>();

  private readonly DEFAULT_ATTEMPTS = 5;

  render() {
    return (
      <div>
        <div>Загрузите файл словаря.</div>
        <div>
          <input type="file" onChange={this.onLoadDict} />
        </div>
        <button disabled={this.words.length === 0} onClick={this.onStartNewGame}>
          Играть
        </button>
      </div>
    );
  }

  private onLoadDict = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const target = event.target as HTMLInputElement;

    fileReader.onload = (() => {
      const rawWords = fileReader.result as string;
      this.setWords(rawWords.split("\n").map((w) => w.trim()));
      target.value = "";
    }).bind(this);

    fileReader.readAsText(target.files[0]);
  };

  @action
  private setWords(words: string[]) {
    this.words.splice(0, this.words.length, ...words);
  }

  private onStartNewGame = () => {
    this.props.onStartNewGame(this.words, this.DEFAULT_ATTEMPTS);
  };
}
