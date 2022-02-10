import { injectable } from "inversify";
import { action, observable } from "mobx";
import { ActionResult } from "../types";
import { ServerResponse } from "./RequestSender";

export enum GameManagerState {
  BEFORE_START = "BEFORE_START",
  ROUND_RUNNING = "ROUND_RUNNING",
  ROUND_ENDED = "ROUND_ENDED",
  AFTER_END = "AFTER_END",
}

type InnerState = {
  state: GameManagerState;
  currentMask?: string;
  attemptsLeft?: number;
  lastActionResult?: ActionResult;
};

@injectable()
export class GameManager {
  private _state = observable.object<InnerState>({
    state: undefined,
  });

  @action
  init(state: GameManagerState, currentMask?: string, attemptsLeft?: number) {
    this._state.state = state;
    this._state.currentMask = currentMask;
    this._state.attemptsLeft = attemptsLeft;
  }

  @action
  startRound(mask: string, attempts: number) {
    this._state.state = GameManagerState.ROUND_RUNNING;
    this._state.currentMask = mask;
    this._state.attemptsLeft = attempts;
  }

  @action
  setLastActionResult(actionResult: ActionResult) {
    this._state.lastActionResult = actionResult;
  }

  @action
  endRound(word: string, action: ActionResult) {
    this._state.state = GameManagerState.ROUND_ENDED;
    this._state.currentMask = word;
    this._state.lastActionResult = action;
  }

  @action
  onAttemptMade({ action, word, wordsLeft, attempts }: ServerResponse) {
    this._state.lastActionResult = action;
    switch (action) {
      case ActionResult.USED:
        break;

      case ActionResult.OK:
        this._state.currentMask = word;
        break;

      case ActionResult.FAIL:
        this._state.attemptsLeft = attempts;
        break;

      case ActionResult.WIN:
      case ActionResult.LOOSE:
        if (wordsLeft) this.endRound(word, action);
        else this.endGame(word, action);
        return;
    }
  }

  @action
  endGame(word?: string, action?: ActionResult) {
    this._state.state = GameManagerState.AFTER_END;
    if (word) this._state.currentMask = word;
    if (action) this._state.lastActionResult = action;
  }

  get state() {
    return this._state.state;
  }

  get currentMask() {
    return this._state.currentMask;
  }

  get attemptsLeft() {
    return this._state.attemptsLeft;
  }

  get lastActionResult() {
    return this._state.lastActionResult;
  }

  get wasInited() {
    return this._state.state !== undefined;
  }
}
