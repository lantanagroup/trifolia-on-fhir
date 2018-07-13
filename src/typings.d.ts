/* SystemJS module definition */

declare module '*.json' {
    const value: any;
    export default value;
}

declare var module: NodeModule;
interface NodeModule {
  id: string;
}
