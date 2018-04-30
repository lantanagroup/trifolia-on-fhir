/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface ConfigFhirServerModel {
  id: string;
  name: string;
}

interface ConfigModel {
  fhirServers: ConfigFhirServerModel[];
}