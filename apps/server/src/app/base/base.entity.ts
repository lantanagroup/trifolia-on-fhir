import { Schema } from "@nestjs/mongoose";

@Schema()
export class BaseEntity {
    id?: string;
}