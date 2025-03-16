import { InternalServerErrorException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";


export const organisationConnectionProvider = {
    provide:"ORGANISATION_CONNECTION",
    useFactory: async (request, connection:Connection) => {
        if(!request?.organisationId){
            throw new InternalServerErrorException("Organisation id missing from header")
        }
        return connection.useDb(`organisation_${request.organisationId}`)
    },
    inject:[REQUEST, getConnectionToken()]
}