import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { createTerminalGameIo, ITerminalGameIo, Key, KeyName } from 'terminal-game-io';

@Component({
  selector: 'app-game',
  template: `
    <div style="padding: 20px">
      <div style="background: white;">
        <pre [attr.id]="domElementId"></pre>
      </div>
    </div>
  `
})
export class GameComponent implements OnInit, OnDestroy {  
  @Input()
  public background: string = '.';

  @Input()
  public player: string = '@';

  @Input()
  public sizeX: number = 16;

  @Input()
  public sizeY: number = 9; 

  public domElementId: string;

  protected terminalGameIo: ITerminalGameIo;
  protected x = 0;
  protected y = 0;

  public constructor() {
    this.domElementId = 'unique-id-' + (Math.random() * 1000000).toFixed(0);
  }

  public ngOnInit(): void {
    this.terminalGameIo = createTerminalGameIo({
      frameHandler: this.frameHandler.bind(this),
      keypressHandler: this.keypressHandler.bind(this),
      fps: 0.5,
      domElementId: this.domElementId
    });
  }

  public ngOnDestroy(): void {
    this.terminalGameIo.exit();
  }

  protected frameHandler(instance: ITerminalGameIo): void {
    let frame: string = (new Array(this.sizeX * this.sizeY + 1)).join(this.background);
    const position = this.y * this.sizeX + this.x;

    if (position >= 0 && position < this.sizeX * this.sizeY) {
      frame = frame.substr(0, position) + this.player + frame.substr(position + 1);
    }

    instance.drawFrame(frame, this.sizeX, this.sizeY);
  }

  protected keypressHandler(instance: ITerminalGameIo, keyName: KeyName): void {
    switch (keyName) {
      case Key.ArrowDown: this.y++; break;
      case Key.ArrowUp: this.y--; break;
      case Key.ArrowRight: this.x++; break;
      case Key.ArrowLeft: this.x--; break;
    }
    this.frameHandler(instance);
  }
}
