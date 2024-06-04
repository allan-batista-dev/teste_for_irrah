import { Users } from "@prisma/client";

export class UserEntity implements Users {
    phone: string;
    id: number;
    creted_at: Date;
    upadated_at: Date;
    email: string;
    name: string;
    password: string;
}
