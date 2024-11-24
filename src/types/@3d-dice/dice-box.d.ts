declare module '@3d-dice/dice-box' {
  interface DiceBoxOptions {
    theme?: string;
    assetPath?: string;
    scale?: number;
    gravity?: number;
    lightIntensity?: number;
  }

  class DiceBox {
    constructor( options?: DiceBoxOptions);
    init(): Promise<void>;
    roll(notation: string): Promise<void>;
    clear(): void;
  }

  export default DiceBox;
}
