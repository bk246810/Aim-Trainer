/**
 * A timer that you check if it's running
 */
export class BasicTimer {
  constructor(public duration: number) {}

  private startTime: number | undefined;

  start(time: number) {
    this.startTime = time;
    this._isRunning = true;
  }

  get isRunning() {
    return this._isRunning;
  }
  private _isRunning = false;

  update(time: number) {
    if (!this._isRunning || this.startTime === undefined) return;

    const elapsed = time - this.startTime;
    if (elapsed > this.duration) {
      this.startTime = undefined;
      this._isRunning = false;
    }
  }
}

/**
 * A timer that calls a callback when it finishes
 */
export class CallbackTimer extends BasicTimer {
  constructor(
    public duration: number,
    public callback: (t: number) => void
  ) {
    super(duration);
  }

  update(time: number) {
    if (this.isRunning) {
      super.update(time);
      // if state switches from running to not running, call the callback
      if (!this.isRunning) {
        this.callback(time);
      }
    }
  }
}
