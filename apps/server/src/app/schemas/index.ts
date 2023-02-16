import { ModelDefinition } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "./project.schema";
import { User, UserSchema } from "./user.schema";

export const modelDefinitions: ModelDefinition[] = [
    {name: Project.name, schema: ProjectSchema},
    {name: User.name, schema: UserSchema}
]