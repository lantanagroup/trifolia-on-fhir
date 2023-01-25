import { ModelDefinition } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "./project.schema";

export const modelDefinitions: ModelDefinition[] = [
    {name: Project.name, schema: ProjectSchema}
]